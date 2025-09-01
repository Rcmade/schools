import { coerce, object, string, type z } from "zod";
import { stringOrArray } from ".";

export const schoolSearchSchema = object({
  city: string().optional(),
  boards: stringOrArray.optional(),
  mediums: stringOrArray.optional(),
  minFees: coerce.number().min(0).default(0),
  maxFees: coerce.number().min(0).default(500000),
  search: string().optional(),
  page: coerce.number().min(1).default(1),
  pageSize: coerce.number().min(1).max(50).default(10),
});

export type SchoolSearchSchemaT = z.infer<typeof schoolSearchSchema>;
