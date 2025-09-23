import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: {
              include: {
                permissions: {
                  include: { permission: true },
                },
              },
            },
          },
        },
      },
    });

    const data = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      roles: u.roles.map((r) => r.role.name),
      permissions: [
        ...new Set(
          u.roles.flatMap((r) =>
            r.role.permissions.map((rp) => rp.permission.name)
          )
        ),
      ],
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
