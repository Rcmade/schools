import { getDb } from "@/lib/db/db";
import { schools } from "@/lib/db/schema";
import { formatError } from "@/lib/utils/errorUtils";
import { schoolSchema } from "@/zodSchema/schoolSchema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const adminSchoolRoutes = new Hono()
  .post("/", zValidator("json", schoolSchema), async (c) => {
    try {
      // Get validated data
      const data = c.req.valid("json");

      const db = getDb();
      // Insert into DB
      const [newSchool] = await db.insert(schools).values({
        name: data.name,
        board: data.board,
        medium: data.medium,
        type: data.type,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
        address: data.address,
        feesMin: data.feesMin,
        feesMax: data.feesMax,
        phone: data.phone,
        email: data.email,
        website: data.website,
        image: typeof data.image === "string" ? data.image : undefined,
      });
      // Return created school
      return c.json(
        { message: "School created", school: newSchool.insertId },
        201
      );
    } catch (error) {
      const err = formatError(error);
      console.error("Ad creation error:", error);
      return c.json({ error: err.message }, err.statusCode);
    }
  })
 
