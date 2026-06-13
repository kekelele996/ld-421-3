import type { User } from "../types/interfaces.ts";
import { reservationService } from "../services/reservation.service.ts";
import { auditLogMiddleware } from "../middlewares/auditLog.middleware.ts";
import { rbacMiddleware } from "../middlewares/rbac.middleware.ts";

export const reservationController = {
  list(query: URLSearchParams) {
    return reservationService.list(query.get("equipmentId") ?? "");
  },
  create(user: User, body: Record<string, unknown>) {
    const record = reservationService.create(body);
    auditLogMiddleware(user, "CREATE_RESERVATION", "Reservation", record.id);
    return record;
  },
  approve(user: User, id: string, approved: boolean) {
    rbacMiddleware(user, ["Admin", "LabManager"]);
    const record = reservationService.approve(id, user.id, approved);
    auditLogMiddleware(user, approved ? "APPROVE_RESERVATION" : "REJECT_RESERVATION", "Reservation", record.id);
    return record;
  },
  cancel(user: User, id: string) {
    const record = reservationService.cancel(id);
    auditLogMiddleware(user, "CANCEL_RESERVATION", "Reservation", record.id);
    return record;
  }
};
