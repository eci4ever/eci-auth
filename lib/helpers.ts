import { UserSafe } from "@/app/dashboard/user-context";

// check single
export function hasRole(user: UserSafe, role: string) {
  return user?.roles?.includes(role) ?? false;
}

export function hasPermission(user: UserSafe, permission: string) {
  return user?.permissions?.includes(permission) ?? false;
}

// check multiple (any)
export function hasAnyRole(user: UserSafe, roles: string[]) {
  return roles.some((role) => user?.roles?.includes(role));
}

export function hasAnyPermission(user: UserSafe, permissions: string[]) {
  return permissions.some((p) => user?.permissions?.includes(p));
}

// check multiple (all) → kalau nak
export function hasAllRoles(user: UserSafe, roles: string[]) {
  return roles.every((role) => user?.roles?.includes(role));
}

export function hasAllPermissions(user: UserSafe, permissions: string[]) {
  return permissions.every((p) => user?.permissions?.includes(p));
}

/**
 * canAccess
 * @param user user object
 * @param options roles | permissions | mode
 * mode: "any" (default) | "all"
 */
export function canAccess(
  user: UserSafe | null | undefined,
  options: {
    roles?: string[];
    permissions?: string[];
    mode?: "any" | "all";
  }
): boolean {
  if (!user) return false;

  const { roles = [], permissions = [], mode = "any" } = options;

  let roleCheck = true;
  let permCheck = true;

  if (roles.length > 0) {
    roleCheck =
      mode === "all" ? hasAllRoles(user, roles) : hasAnyRole(user, roles);
  }

  if (permissions.length > 0) {
    permCheck =
      mode === "all"
        ? hasAllPermissions(user, permissions)
        : hasAnyPermission(user, permissions);
  }

  return roleCheck && permCheck;
}
