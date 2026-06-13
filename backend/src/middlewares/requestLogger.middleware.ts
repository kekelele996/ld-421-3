import type { IncomingMessage } from "node:http";
import { logInfo } from "../utils/logger.ts";

export function requestLoggerMiddleware(req: IncomingMessage) {
  logInfo("request", { method: req.method, url: req.url });
}
