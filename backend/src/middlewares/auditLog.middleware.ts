import { auditLogs } from "../database/seeds/seed.ts";
import type { User } from "../types/interfaces.ts";

export function auditLogMiddleware(user: User, action: string, entity: string, entityId: string) {
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    actorId: user.id,
    action,
    entity,
    entityId,
    createdAt: new Date().toISOString()
  });
}
