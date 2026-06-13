import { createServer, type IncomingMessage } from "node:http";
import { auditLogs } from "./database/seeds/seed.ts";
import { equipmentRoutes } from "./routes/equipment.routes.ts";
import { borrowRoutes } from "./routes/borrow.routes.ts";
import { maintenanceRoutes } from "./routes/maintenance.routes.ts";
import { reservationRoutes } from "./routes/reservation.routes.ts";
import { categoryRoutes } from "./routes/category.routes.ts";
import { dashboardService } from "./services/dashboard.service.ts";
import { authMiddleware } from "./middlewares/auth.middleware.ts";
import { requestLoggerMiddleware } from "./middlewares/requestLogger.middleware.ts";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.middleware.ts";
import { ApiError, ok, created } from "./utils/response.ts";

async function parseBody(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

const server = createServer(async (req, res) => {
  try {
    requestLoggerMiddleware(req);
    res.setHeader("access-control-allow-origin", "*");
    res.setHeader("access-control-allow-headers", "content-type, authorization, x-demo-role");
    res.setHeader("access-control-allow-methods", "GET,POST,PATCH,OPTIONS");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url ?? "/", "http://localhost");
    const path = url.pathname;
    const method = req.method ?? "GET";
    const user = authMiddleware(req);
    const body = ["POST", "PATCH", "PUT"].includes(method) ? await parseBody(req) : {};

    let data: unknown;
    if (method === "GET" && path === "/api/health") data = { status: "ok", service: "lab-equipment", time: new Date().toISOString() };
    else if (method === "GET" && path === "/api/dashboard") data = dashboardService.summary();
    else if (method === "GET" && path === "/api/audit-logs") data = auditLogs;
    else data =
      categoryRoutes(method, path) ??
      equipmentRoutes(method, path, url.searchParams, user as never, body) ??
      borrowRoutes(method, path, url.searchParams, user as never, body) ??
      reservationRoutes(method, path, url.searchParams, user as never, body) ??
      maintenanceRoutes(method, path, url.searchParams, user as never, body);

    if (data === undefined) throw new ApiError(404, "NOT_FOUND", "接口不存在");
    res.writeHead(method === "POST" ? 201 : 200, { "content-type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(method === "POST" ? created(data) : ok(data)));
  } catch (error) {
    errorHandlerMiddleware(res, error);
  }
});

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";
server.listen(port, host, () => {
  console.log(`lab-equipment backend listening on ${host}:${port}`);
});
