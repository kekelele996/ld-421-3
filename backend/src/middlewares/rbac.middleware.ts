import type { UserRole } from "../types/enums.ts";
import type { User } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";

const rank: Record<UserRole, number> = { Student: 1, Researcher: 2, LabManager: 3, Admin: 4 };

export function rbacMiddleware(user: User, allowed: UserRole[]) {
  if (!allowed.includes(user.role)) {
    throw new ApiError(403, "FORBIDDEN", `当前角色 ${user.role} 无权执行该操作`);
  }
}

export function canApprove(user: User) {
  return rank[user.role] >= rank.LabManager;
}
