export function logInfo(message: string, details: Record<string, unknown> = {}) {
  console.log(JSON.stringify({ level: "info", message, ...details }));
}

export function logError(message: string, details: Record<string, unknown> = {}) {
  console.error(JSON.stringify({ level: "error", message, ...details }));
}
