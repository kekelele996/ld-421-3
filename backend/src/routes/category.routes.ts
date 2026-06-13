import { categoryController } from "../controllers/category.controller.ts";

export function categoryRoutes(method: string, path: string) {
  if (method === "GET" && path === "/api/categories") return categoryController.tree();
  return undefined;
}
