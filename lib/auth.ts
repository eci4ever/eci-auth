import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User as PrismaUser } from "@prisma/client";
import { authConfig } from "../auth.config";
import { PrismaClient } from "@prisma/client";
import { getUserRolesAndPermissions } from "./actions";

const prisma = new PrismaClient();

async function getUser(email: string): Promise<PrismaUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const { roles, permissions } = await getUserRolesAndPermissions(
            user.id
          );

          console.log("Roles:", roles);
          console.log("Permissions:", permissions);

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch)
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              roles,
              permissions,
            };
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});
