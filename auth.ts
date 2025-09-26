import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    updateAge: 60 * 60 * 24, // refresh claim setiap 24 jam
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials.email as string) ?? "";
        const password = (credentials.password as string) ?? "";
        const normalizedEmail = email.toLowerCase().trim();

        const user = await prisma.user.findUnique({
          where: { email: normalizedEmail },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
          },
        });

        if (!user?.password) {
          return null;
        }

        // Check lockout window (if schema already supports it)
        const lockUntil = (user as any)?.lockUntil as Date | null | undefined;
        if (lockUntil && new Date(lockUntil) > new Date()) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          const failedLoginAttempts =
            ((user as any)?.failedLoginAttempts as number | undefined) ?? 0;
          const newAttempts = failedLoginAttempts + 1;
          const shouldLock = newAttempts >= 5; // threshold
          const updateData: any = {};
          // Only attempt to update if the schema has these fields
          updateData.failedLoginAttempts = shouldLock ? 0 : newAttempts;
          updateData.lockUntil = shouldLock
            ? new Date(Date.now() + 15 * 60 * 1000)
            : null;
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: updateData,
            } as any);
          } catch {}
          return null;
        }

        // Reset counters on success (if fields exist)
        try {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLoginAttempts: 0, lockUntil: null } as any,
          } as any);
        } catch {}

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      if (!user.id) {
        console.error("User ID tidak wujud semasa createUser event");
        return;
      }

      const userRole = await prisma.role.findUnique({
        where: { name: "User" },
      });

      if (userRole) {
        await prisma.userRole.create({
          data: {
            userId: user.id, // sekarang confirm string
            roleId: userRole.id, // roleId integer
          },
        });
      }
    },

    async signIn({ user, account }) {
      if (!user?.id) return;

      // Update lastLogin setiap kali user berjaya login
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
        },
      });

      console.log(`User ${user.email} login melalui ${account?.provider}`);
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.userId = user.id;
      // Hydrate roles sekali (atau boleh kemas kini ikut keperluan)
      if (user?.email) {
        const u = await prisma.user.findUnique({
          where: { email: user.email.toLowerCase().trim() },
          include: { roles: { include: { role: true } } },
        });
        token.roles = u?.roles.map((r) => r.role.name) ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.userId) (session.user as any).id = token.userId as string;
      if (token?.roles) (session.user as any).roles = token.roles as string[];
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const isProtected =
        pathname.startsWith("/dashboard") || pathname.startsWith("/api/users");
      if (!isProtected) return true;
      return !!auth?.user;
    },
  },
});
