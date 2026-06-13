import type { User } from "../types/interfaces.ts";
import { borrowService } from "../services/borrow.service.ts";
import { auditLogMiddleware } from "../middlewares/auditLog.middleware.ts";
import { rbacMiddleware } from "../middlewares/rbac.middleware.ts";

export const borrowController = {
  list(query: URLSearchParams) {
    return borrowService.list(query.get("status") ?? "");
  },
  create(user: User, body: Record<string, unknown>) {
    const record = borrowService.create(body);
    auditLogMiddleware(user, "SUBMIT_BORROW", "BorrowRecord", record.id);
    return record;
  },
  approve(user: User, id: string, approved: boolean) {
    rbacMiddleware(user, ["Admin", "LabManager"]);
    const record = borrowService.approve(id, user.id, approved);
    auditLogMiddleware(user, approved ? "APPROVE_BORROW" : "REJECT_BORROW", "BorrowRecord", record.id);
    return record;
  },
  confirmReturn(user: User, id: string, condition: string) {
    rbacMiddleware(user, ["Admin", "LabManager", "Researcher"]);
    const record = borrowService.confirmReturn(id, condition as never);
    auditLogMiddleware(user, "CONFIRM_RETURN", "BorrowRecord", record.id);
    return record;
  }
};
