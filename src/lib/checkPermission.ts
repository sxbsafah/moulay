import { QueryCtx } from "../../convex/_generated/server";
import { Id } from "../../convex/_generated/dataModel";

export type Role = (typeof VALID_ROLES)[keyof typeof VALID_ROLES];

const VALID_ROLES = {
  USER: "user",
  ADMIN: "admin",
} as const;

const roleHierarchy: Record<Role, number> = {
  user: 0,
  admin: 1,
};

export default async function checkPermission(
  ctx: QueryCtx,
  userId: Id<"users">,
  requiredRole: Role,
) {
  const user = await ctx.db.get("users", userId);
  if (!user || !user.role || !(user.role in roleHierarchy)) return false;
  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}
