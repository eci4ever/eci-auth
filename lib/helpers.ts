export function hasRole(
  userRoles: string[] | undefined,
  role: string
): boolean {
  if (!userRoles) return false;
  return userRoles.includes(role);
}

export function hasPermission(
  userPermissions: string[] | undefined,
  permission: string
): boolean {
  if (!userPermissions) return false;
  return userPermissions.includes(permission);
}

export function canAccess(
  userRoles: string[] | undefined,
  userPermissions: string[] | undefined,
  requiredRoles: string[] = [],
  requiredPermissions: string[] = []
): boolean {
  if (requiredRoles.length === 0 && requiredPermissions.length === 0) {
    return true; // No specific roles or permissions required
  }

  const hasRequiredRole = requiredRoles.some((role) =>
    hasRole(userRoles, role)
  );
  const hasRequiredPermission = requiredPermissions.some((permission) =>
    hasPermission(userPermissions, permission)
  );

  return hasRequiredRole || hasRequiredPermission;
}

export function hasAnyRole(
  userRoles: string[] | undefined,
  roles: string[]
): boolean {
  if (!userRoles) return false;
  return roles.some((r) => userRoles.includes(r));
}
export function hasAnyPermission(
  userPermissions: string[] | undefined,
  permissions: string[]
): boolean {
  if (!userPermissions) return false;
  return permissions.some((p) => userPermissions.includes(p));
}
export function canAccessAny(
  userRoles: string[] | undefined,
  userPermissions: string[] | undefined,
  requiredRoles: string[] = [],
  requiredPermissions: string[] = []
): boolean {
  if (requiredRoles.length === 0 && requiredPermissions.length === 0) {
    return true; // No specific roles or permissions required
  }

  const hasRequiredRole = hasAnyRole(userRoles, requiredRoles);
  const hasRequiredPermission = hasAnyPermission(
    userPermissions,
    requiredPermissions
  );

  return hasRequiredRole || hasRequiredPermission;
}
