import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // npm install bcryptjs

const prisma = new PrismaClient();

async function main() {
  // Roles
  const roles = [
    { name: "admin", description: "Full access to all resources" },
    { name: "editor", description: "Can create and update resources" },
    { name: "viewer", description: "Read-only access" },
  ];

  // Permissions
  const permissions = [
    { name: "create_user", description: "Can create new users" },
    { name: "delete_user", description: "Can delete users" },
    { name: "update_user", description: "Can update users" },
    { name: "view_user", description: "Can view user list" },
    { name: "create_product", description: "Can create products" },
    { name: "delete_product", description: "Can delete products" },
    { name: "update_product", description: "Can update products" },
    { name: "view_product", description: "Can view products" },
  ];

  // Upsert roles
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // Upsert permissions
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { name: permission.name },
      update: {},
      create: permission,
    });
  }

  // Fetch roles and permissions
  const adminRole = await prisma.role.findUnique({ where: { name: "admin" } });
  const editorRole = await prisma.role.findUnique({
    where: { name: "editor" },
  });
  const viewerRole = await prisma.role.findUnique({
    where: { name: "viewer" },
  });

  const allPermissions = await prisma.permission.findMany();

  // Assign permissions
  if (adminRole) {
    for (const permission of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  if (editorRole) {
    const editorPermissions = allPermissions.filter((p) =>
      ["create_product", "update_product", "view_product"].includes(p.name)
    );

    for (const permission of editorPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: editorRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: editorRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  if (viewerRole) {
    const viewerPermissions = allPermissions.filter((p) =>
      ["view_product", "view_user"].includes(p.name)
    );

    for (const permission of viewerPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: viewerRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: viewerRole.id,
          permissionId: permission.id,
        },
      });
    }
  }

  // Default users
  const users = [
    {
      email: "admin@eci.com",
      name: "Admin User",
      password: await bcrypt.hash("password123", 10),
      role: adminRole,
    },
    {
      email: "editor@eci.com",
      name: "Editor User",
      password: await bcrypt.hash("password123", 10),
      role: editorRole,
    },
    {
      email: "viewer@eci.com",
      name: "Viewer User",
      password: await bcrypt.hash("password123", 10),
      role: viewerRole,
    },
  ];

  for (const user of users) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        name: user.name,
        password: user.password,
      },
    });

    if (user.role) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: createdUser.id,
            roleId: user.role.id,
          },
        },
        update: {},
        create: {
          userId: createdUser.id,
          roleId: user.role.id,
        },
      });
    }
  }

  console.log(
    "✅ Roles, permissions & default users seeded successfully (cuid IDs)!"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
