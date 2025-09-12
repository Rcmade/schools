import { LoginVerificationStage } from "@/types/enum";
import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email(),
});

export type SignUpSchemaT = z.infer<typeof signUpSchema>;

export const loginSchema = z
  .object({
    email: z.email(),
    otp: z.string().optional(),
    // .length(6, "OTP must be 6 digits").optional().nullable(),
    hash: z.string().optional(),
    stage: z.nativeEnum(LoginVerificationStage),
  })
  .superRefine((data, ctx) => {
    if (data.stage === LoginVerificationStage.Initial) {
      // For Initial stage, `otp` and `hash` must not exist
      if (data.otp) {
        ctx.addIssue({
          code: "custom", // Specify the issue type
          path: ["otp"],
          message: "`otp` should not be provided in the Initial stage.",
        });
      }
      if (data.hash) {
        ctx.addIssue({
          code: "custom",
          path: ["hash"],
          message: "`hash` should not be provided in the Initial stage.",
        });
      }
    } else if (data.stage === LoginVerificationStage.OTPVerify) {
      // For OTPVerify stage, both `otp` and `hash` must be present
      if (!data.otp || data.otp.length !== 6) {
        ctx.addIssue({
          code: "custom",
          path: ["otp"],
          message: "`otp` is required and must be 6 digits.",
        });
      }
      if (!data.hash) {
        ctx.addIssue({
          code: "custom",
          path: ["hash"],
          message: "`hash` is required for Verification.",
        });
      }
    }
  });

export type LoginSchemaT = z.infer<typeof loginSchema>;
