import { email, number, object, string, url, z } from "zod";

export const schoolSchema = object({
  name: string().min(1, "School name is required").trim(),
  board: string().min(1, "Board is required").trim(),
  medium: string().min(1, "Medium is required").trim(),
  type: string().min(1, "Type is required").trim(),

  city: string().min(1, "City is required").trim(),
  state: string().min(1, "State is required").trim(),
  pinCode: string().regex(/^\d{6}$/, "Pin code must be a 6-digit number"),
  address: string().min(5, "Address is too short").trim(),

  feesMin: number().nonnegative("Minimum fees cannot be negative"),
  feesMax: number().nonnegative("Maximum fees cannot be negative"),

  phone: string().regex(/^\+?\d{10,15}$/, "Phone number must be valid"),
  email: email("Invalid email address"),
  website: url("Invalid URL"),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
}).refine((data) => data.feesMax >= data.feesMin, {
  message: "Maximum fees must be greater than or equal to minimum fees",
  path: ["feesMax"],
});

export type SchoolSchemaT = z.infer<typeof schoolSchema>;
