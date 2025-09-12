import { signIn } from "@/config/authConfig";
import { getDb } from "@/lib/db/db";

import { users } from "@/lib/db/schema";
import { formatError } from "@/lib/utils/errorUtils";
import {
  formateVerifyHashString,
  getOtpRedirectUrl,
} from "@/lib/utils/stringUtils";
import HashService from "@/services/hashService";
import OTPService from "@/services/otpService";
import { SendService } from "@/services/sendService";
import { LoginVerificationStage } from "@/types/enum";
import { loginSchema, signUpSchema } from "@/zodSchema/authSchema";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { Hono } from "hono";

export const authRoute = new Hono()
  .post("/signup", zValidator("json", signUpSchema), async (c) => {
    try {
      const db = getDb();
      const body = c.req.valid("json");
      const [existingUser] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, body.email));

      if (existingUser) {
        return c.json({ message: "User already exists" }, 400);
      }
      const [user] = await db.insert(users).values({
        name: body.name,
        email: body.email,
      });

      return c.json({ message: "User created", data: user }, 201);
    } catch (error) {
      return c.json(
        { message: "Internal server error", errors: String(error) },
        500
      );
    }
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    try {
      const db = getDb();

      // Extract and validate request body
      const body = c.req.valid("json");
      const { email, hash: otpHash, otp, stage } = body;

      const [user] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
        })
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      // If no user is found, return a 404 error
      if (!user) {
        return c.json({ message: "User not found" }, 404);
      }

      // Handle different login verification stages
      switch (stage) {
        case LoginVerificationStage.Initial:
          // Generate a new OTP
          const generateOtp = OTPService.createOtp().toString();

          // Hash the OTP with the email for secure verification

          const hash = HashService.hashOtp(
            formateVerifyHashString({ email, otp: generateOtp })
          );
          // Send the OTP via SMS
          const isOtpSent = await SendService.sendLoginEmail(
            email,
            generateOtp
          );

          // Handle failure in sending the OTP
          if (!isOtpSent) {
            return c.json(
              { message: "Failed to send OTP. Please try again later." },
              500
            );
          }

          // Generate the OTP redirect URL
          const redirectUrl = await getOtpRedirectUrl({
            hash,
            email,
          });

          const message =
            process.env.OTP_SERVICE_AVAILABLE !== "true"
              ? `Your OTP is ${generateOtp}`
              : "OTP sent";
          // Respond with success and the redirect URL
          return c.json({
            message: message,
            stage: LoginVerificationStage.OTPSent,
            data: {
              redirect: redirectUrl,
              hash,
              otp:
                process.env.OTP_SERVICE_AVAILABLE !== "true" ? generateOtp : "",
            },
          });

        case LoginVerificationStage.OTPVerify:
          // Ensure OTP and hash are provided for verification
          if (!otpHash || !otp) {
            return c.json(
              { message: "Invalid request. Please provide OTP." },
              400
            );
          }

          // Verify the OTP using the hashed value
          const isValid = OTPService.verifyOtp(
            otpHash,
            formateVerifyHashString({ email, otp: otp })
          );

          // Handle invalid OTP
          if (!isValid) {
            return c.json({ message: "Invalid OTP" }, 400);
          }

          await signIn("credentials", {
            name: user.name,
            email: user.email,
            // role: users.role,
            redirect: false,
          });

          const redirect = "/";
          // if (user.role === "SUPER_ADMIN") {
          //   redirect = "/admin/dashboard/organization";
          // } else if (user.role !== "USER") {
          //   // Only query the database if the user is not a regular USER
          //   const userOrg = await getOrgByUserId(user.id);
          //   if (!userOrg) {
          //     redirect = "/";
          //   } else if (user.role === "ADMIN") {
          //     redirect = `/admin/dashboard/organization/o/${userOrg.webName}`;
          //   } else {
          //     redirect = `/admin/dashboard/organization/o/${userOrg.webName}/token/search`;
          //   }
          // }
          // Respond with success when OTP is verified
          return c.json({
            message: "OTP verified",
            stage: LoginVerificationStage.OTPVerified,
            data: { redirect: redirect, hash: null, otp: "" },
          });

        default:
          // Handle unsupported stages
          return c.json({ message: "Invalid stage in login flow" }, 400);
      }
    } catch (error) {
      console.error(error);
      // Handle unexpected errors
      const err = formatError(error);
      return c.json(
        {
          message: err.message || "Internal server error while login",
          error,
        },
        err.statusCode
      );
    }
  });

export type AppType = typeof authRoute;
