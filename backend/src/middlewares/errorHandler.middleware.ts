import type { ServerResponse } from "node:http";
import { ApiError } from "../utils/response.ts";
import { logError } from "../utils/logger.ts";

export function errorHandlerMiddleware(res: ServerResponse, error: unknown) {
  const apiError = error instanceof ApiError ? error : new ApiError(500, "INTERNAL_ERROR", "服务器内部错误");
  if (!(error instanceof ApiError)) logError("Unhandled request error", { error: String(error) });
  res.writeHead(apiError.status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ code: apiError.code, message: apiError.message }));
}
