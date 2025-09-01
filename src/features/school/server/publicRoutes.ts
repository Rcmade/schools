import { getDb } from "@/lib/db/db";
import { schools } from "@/lib/db/schema";
import { zValidator } from "@hono/zod-validator";
import { and, isNotNull, like } from "drizzle-orm";
import { Hono } from "hono";
import { object, string } from "zod";

const publicRoutes = new Hono()
  .get("/board-medium", async (c) => {
    const db = getDb();
    const [boardsRows, mediumsRows] = await Promise.all([
      db
        .select({ name: schools.board })
        .from(schools)
        .where(isNotNull(schools.board))
        .groupBy(schools.board)
        .orderBy(schools.board),

      db
        .select({ name: schools.medium })
        .from(schools)
        .where(isNotNull(schools.medium))
        .groupBy(schools.medium)
        .orderBy(schools.medium),
    ]);

    return c.json({
      boards: boardsRows.map((r) => ({
        label: r.name?.replace("-", " "),
        value: r.name,
      })),
      medium: mediumsRows.map((r) => ({
        label: r.name?.replace("-", " "),
        value: r.name,
      })),
    });
  })
  .get(
    "/cities",
    zValidator("query", object({ city: string().optional() })),
    async (c) => {
      const db = getDb();
      const city = c.req.valid("query").city;
        const whereClause = city
          ? and(isNotNull(schools.city), like(schools.city, `%${city?.toLowerCase()}%`))
          : isNotNull(schools.city);
      const rows = await db
        .select({ name: schools.city })
        .from(schools)
        .where(whereClause)
        .groupBy(schools.city)
        .orderBy(schools.city)
        .limit(10);

      return c.json(
        rows.map((r) => ({
          label: r.name?.replace("-", " ") ?? "",
          value: r.name,
        }))
      );
    }
  );
export default publicRoutes;
