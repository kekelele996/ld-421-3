import { equipmentController } from "../controllers/equipment.controller.ts";

export function equipmentRoutes(method: string, path: string, query: URLSearchParams, user: never, body: Record<string, unknown>) {
  if (method === "GET" && path === "/api/equipment") return equipmentController.list(query);
  if (method === "GET" && path.startsWith("/api/equipment/")) return equipmentController.detail(path.split("/").at(-1) ?? "");
  if (method === "POST" && path === "/api/equipment") return equipmentController.create(user, body);
  return undefined;
}
