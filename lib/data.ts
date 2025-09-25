import { prisma } from "@/prisma";
import { User as PrismaUser } from "@prisma/client";

export async function getUser(email: string): Promise<PrismaUser | null> {
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

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        // profile: false, // kalau ada Profile
      },
    });

    return users.map((user) => {
      const roles = user.roles.map((ur) => ur.role.name);

      // const permissions = user.roles.flatMap((ur) =>
      //   ur.role.permissions.map((rp) => rp.permission.name)
      // );

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        status: user.isActive,
        lastLogin: user.lastLogin,
        roles,
        // permissions: [...new Set(permissions)], // remove duplicates
        // profile: user.profile ?? null,
      };
    });
  } catch (err) {
    console.error("❌ Error getAllUsers:", err);
    return [];
  }
}
