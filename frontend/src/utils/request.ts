export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { "content-type": "application/json", "x-demo-role": "LabManager", ...(options.headers || {}) }
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message ?? "请求失败");
  return payload.data as T;
}
