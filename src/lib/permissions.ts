type Action = "canRead" | "canCreate" | "canUpdate" | "canDelete";

interface ExtraPermission {
  collection: string;
  canRead?: boolean;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
}

interface UserWithPermissions {
  role?: string;
  extraPermissions?: ExtraPermission[];
}

export function hasPermission(
  user: UserWithPermissions | null | undefined,
  collection: string,
  action: Action
): boolean {
  if (!user?.extraPermissions) return false;
  return user.extraPermissions.some(
    (p) => p.collection === collection && p[action] === true
  );
}
