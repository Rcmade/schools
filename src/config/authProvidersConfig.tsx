import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const authProvidersConfig = {
  providers: [
    Credentials({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      async authorize(credentials) {
        if (credentials?.email) {
          const db = await import("@/lib/db/db").then((res) => res.getDb());
          const [userInfo] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials?.email as string));
          const user = {
            ...userInfo,
          };
          return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

export default authProvidersConfig;
