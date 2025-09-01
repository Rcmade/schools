import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2/promise";

async function main() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST ?? "localhost",
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "app_db",
    port: +(process.env.DB_PORT ?? 3306),
    // ssl: { rejectUnauthorized: false },
    ssl: {
      rejectUnauthorized: true, // enforce SSL
    },
    connectTimeout: 30000, // 30s timeout to avoid ETIMEDOUT
  });

  const db = drizzle(process.env.DATABASE_URL!);
  // const db = drizzle(pool);

  console.log("🚀 Running migrations...");
  await migrate(db, {
    migrationsFolder: "./src/lib/db/migrations",
  });
  console.log("✅ Migrations complete");

  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
