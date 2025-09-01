
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import "server-only";

import type { MySql2Database } from "drizzle-orm/mysql2";
import type { Pool as MySql2PromisePool } from "mysql2/promise";

declare global {
  var __mysqlPool__: MySql2PromisePool | undefined;
  var __drizzle__:
    | (MySql2Database<Record<string, unknown>> & { $client: MySql2PromisePool })
    | undefined;
}

function getPool() {
  if (!global.__mysqlPool__) {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
    if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
      throw new Error(
        "Missing MySQL environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME"
      );
    }

    global.__mysqlPool__ = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT ? Number(DB_PORT) : 3306,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      connectionLimit: 10,
      waitForConnections: true,
      ssl:
        process.env.MYSQL_SSL?.toLowerCase() === "true"
          ? { rejectUnauthorized: false }
          : undefined,
    });
  }
  return global.__mysqlPool__;
}

export function getDb() {
  if (!global.__drizzle__) {
    global.__drizzle__ = drizzle(getPool());
  }
  return global.__drizzle__;
}
