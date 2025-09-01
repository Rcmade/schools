import { getDb } from "@/lib/db/db";
import { schools } from "@/lib/db/schema";
import { schoolSearchSchema } from "@/zodSchema/searchSchema";
import { zValidator } from "@hono/zod-validator";
import { and, eq, gte, inArray, like, lte, sql } from "drizzle-orm";
import { Hono } from "hono";

export const schoolSearchRoutes = new Hono().get(
  "/school",
  zValidator("query", schoolSearchSchema),

  async (c) => {
    const { city, boards, mediums, minFees, maxFees, search, page, pageSize } =
      c.req.valid("query");


    // Base conditions
    const conditions = [
      gte(schools.feesMin, minFees),
      lte(schools.feesMax, maxFees),
    ];

    if (city && city.trim() !== "") {
      conditions.push(eq(schools.city, city));
    }

    if (boards && boards.length > 0) {
      conditions.push(inArray(schools.board, boards));
    }

    if (mediums && mediums.length > 0) {
      conditions.push(inArray(schools.medium, mediums));
    }

    if (search && search.trim() !== "") {
      conditions.push(like(schools.name, `%${search}%`));
    }

    const whereClause = and(...conditions);

    // Pagination
    const offset = (page - 1) * pageSize;

    const db = getDb();
    // Get data
    const rows = await db
      .select()
      .from(schools)
      .where(whereClause)
      .limit(pageSize)
      .offset(offset)
      .orderBy(schools.name);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(schools)
      .where(whereClause);

    return c.json({
      data: rows,
      pagination: {
        page,
        pageSize,
        total: count,
        totalPages: Math.ceil(count / pageSize),
      },
    });
  }
);
