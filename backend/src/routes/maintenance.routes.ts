import { maintenanceController } from "../controllers/maintenance.controller.ts";

export function maintenanceRoutes(method: string, path: string, _query: URLSearchParams, user: never, body: Record<string, unknown>) {
  if (method === "GET" && path === "/api/maintenance") return maintenanceController.list();
  if (method === "POST" && path === "/api/maintenance") return maintenanceController.create(user, body);
  return undefined;
}
