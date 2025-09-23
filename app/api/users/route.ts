import { NextResponse } from "next/server";
import { prisma } from "@/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
  try {
    const { id } = await params; // Await the params promise

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            role: {
              include: { permissions: { include: { permission: true } } },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles: user.roles.map((r) => r.role.name),
      permissions: [
        ...new Set(
          user.roles.flatMap((r) =>
            r.role.permissions.map((rp) => rp.permission.name)
          )
        ),
      ],
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
