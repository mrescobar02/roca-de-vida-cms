type Action = "canRead" | "canCreate" | "canUpdate" | "canDelete";

export function hasPermission(
  user: unknown,
  collection: string,
  action: Action
): boolean {
  if (!user || typeof user !== "object") return false;
  const u = user as Record<string, unknown>;
  const perms = u["extraPermissions"];
  if (!Array.isArray(perms)) return false;
  return perms.some(
    (p) =>
      p &&
      typeof p === "object" &&
      (p as Record<string, unknown>)["collection"] === collection &&
      (p as Record<string, unknown>)[action] === true
  );
}
