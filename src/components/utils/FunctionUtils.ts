import { Role } from "@prisma/client";

export function getUserAccess(role: Role, path: string): string[] {
  try {
    const permissions: { path: string; access: string[] }[] = JSON.parse(
      role.permission || "[]"
    );

    const found = permissions.find((p) => p.path === path);
    return found ? found.access : [];
  } catch {
    return [];
  }
}
export function hasAccess(role: Role, path: string, action: string): boolean {
  return getUserAccess(role, path).includes(action);
}
