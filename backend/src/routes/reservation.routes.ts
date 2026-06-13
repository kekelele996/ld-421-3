import { reservationController } from "../controllers/reservation.controller.ts";

export function reservationRoutes(method: string, path: string, query: URLSearchParams, user: never, body: Record<string, unknown>) {
  if (method === "GET" && path === "/api/reservations") return reservationController.list(query);
  if (method === "POST" && path === "/api/reservations") return reservationController.create(user, body);
  if (method === "PATCH" && path.endsWith("/approve")) return reservationController.approve(user, path.split("/").at(-2) ?? "", body.approved !== false);
  if (method === "PATCH" && path.endsWith("/cancel")) return reservationController.cancel(user, path.split("/").at(-2) ?? "");
  return undefined;
}
