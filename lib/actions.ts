"use server";

import { signIn, signOut } from "./auth";
import { AuthError } from "next-auth";
import { auth } from "./auth";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// ...

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
  // redirect() akan dihandle oleh signOut sendiri
}

// Get current user session
export async function getSession() {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error("Failed to get session:", error);
    return null;
  }
}

// Get current user data
export async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,

        // tambahkan field lain yang diperlukan
      },
    });

    const { roles, permissions } = await getUserRolesAndPermissions(
      user?.id as string
    );

    if (user) {
      return { ...user, roles, permissions };
    }
    console.log(user);
    return user;
  } catch (error) {
    console.error("Failed to get current user:", error);
    return null;
  }
}

export async function getUserRolesAndPermissions(id: string) {
  const user = await prisma.user.findUnique({
    where: { id: id },
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
    },
  });

  if (!user) return { roles: [], permissions: [] };

  const roles = user.roles.map((r) => r.role.name);
  const permissions = user.roles.flatMap((r) =>
    r.role.permissions.map((p) => p.permission.name)
  );

  return { roles, permissions };
}
