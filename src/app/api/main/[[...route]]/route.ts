import { authRoute } from "@/features/auth/server/route";
import { adminSchoolRoutes } from "@/features/school/server/adminSchoolRoutes";
import publicRoutes from "@/features/school/server/publicRoutes";
import { schoolSearchRoutes } from "@/features/search/server/schoolSearchRoutes";
import { uploadsRoutes } from "@/features/uploads/server/route";
import { Hono } from "hono";
import { handle } from "hono/vercel";

// export const runtime = "edge"

const app = new Hono().basePath("/api/main");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route("/admin/school", adminSchoolRoutes)
  .route("/search", schoolSearchRoutes)
  .route("/public/", publicRoutes)
  .route("/uploads", uploadsRoutes)
  .route("/auth", authRoute);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

export type AppType = typeof routes;
