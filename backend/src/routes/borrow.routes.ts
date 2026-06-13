import { borrowController } from "../controllers/borrow.controller.ts";

export function borrowRoutes(method: string, path: string, query: URLSearchParams, user: never, body: Record<string, unknown>) {
  if (method === "GET" && path === "/api/borrow") return borrowController.list(query);
  if (method === "POST" && path === "/api/borrow") return borrowController.create(user, body);
  if (method === "PATCH" && path.endsWith("/approve")) return borrowController.approve(user, path.split("/").at(-2) ?? "", body.approved !== false);
  if (method === "PATCH" && path.endsWith("/return")) return borrowController.confirmReturn(user, path.split("/").at(-2) ?? "", String(body.condition ?? "Good"));
  return undefined;
}
