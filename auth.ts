import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/signin",
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
        const email = credentials.email as string;

        const user = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase().trim(), // case insensitive
          },
          select: {
            id: true, // hanya select id untuk efficiency
            email: true,
            name: true,
          },
        });
        {
          return {
            id: user?.id,
            name: user?.name,
            email: user?.email,
          };
        }

        // kalau gagal
        return null;
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      if (!user.id) {
        console.error("User ID tidak wujud semasa createUser event");
        return;
      }

      const viewerRole = await prisma.role.findUnique({
        where: { name: "Viewer" },
      });

      if (viewerRole) {
        await prisma.userRole.create({
          data: {
            userId: user.id, // sekarang confirm string
            roleId: viewerRole.id, // roleId integer
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
  session: {
    strategy: "jwt",
  },
});
