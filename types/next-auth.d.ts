import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    roles?: string[];
    failedLoginAttempts?: number;
    lockUntil?: Date | null;
    lastLogin?: Date | null;
  }

  interface JWT {
    userId?: string;
    roles?: string[];
  }
}
