import type { User } from "../types/interfaces.ts";
import { maintenanceService } from "../services/maintenance.service.ts";
import { auditLogMiddleware } from "../middlewares/auditLog.middleware.ts";
import { rbacMiddleware } from "../middlewares/rbac.middleware.ts";

export const maintenanceController = {
  list() {
    return { records: maintenanceService.list(), stats: maintenanceService.stats() };
  },
  create(user: User, body: Record<string, unknown>) {
    rbacMiddleware(user, ["Admin", "LabManager"]);
    const record = maintenanceService.create(body);
    auditLogMiddleware(user, "CREATE_MAINTENANCE", "MaintenanceRecord", record.id);
    return record;
  }
};
