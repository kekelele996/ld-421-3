import { API_PATHS } from "../constants/apiPaths";
import { request } from "../utils/request";
import type { BorrowRecord } from "../types/borrow";

export const borrowApi = {
  list: (status = "") => request<BorrowRecord[]>(`${API_PATHS.borrow}?status=${status}`),
  create: (payload: Partial<BorrowRecord>) => request<BorrowRecord>(API_PATHS.borrow, { method: "POST", body: JSON.stringify(payload) }),
  approve: (id: string, approved = true) => request<BorrowRecord>(`${API_PATHS.borrow}/${id}/approve`, { method: "PATCH", body: JSON.stringify({ approved }) }),
  confirmReturn: (id: string) => request<BorrowRecord>(`${API_PATHS.borrow}/${id}/return`, { method: "PATCH", body: JSON.stringify({ condition: "Good" }) })
};
