export function ok(data: unknown, meta: Record<string, unknown> = {}) {
  return { code: "OK", data, meta };
}

export function created(data: unknown) {
  return { code: "CREATED", data };
}

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}
