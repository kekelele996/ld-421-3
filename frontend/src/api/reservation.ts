import { API_PATHS } from "../constants/apiPaths";
import { request } from "../utils/request";
import type { Reservation } from "../types/reservation";

export const reservationApi = {
  list: (equipmentId = "") => request<Reservation[]>(`${API_PATHS.reservations}?equipmentId=${equipmentId}`),
  create: (payload: Partial<Reservation>) => request<Reservation>(API_PATHS.reservations, { method: "POST", body: JSON.stringify(payload) }),
  approve: (id: string, approved = true) => request<Reservation>(`${API_PATHS.reservations}/${id}/approve`, { method: "PATCH", body: JSON.stringify({ approved }) }),
  cancel: (id: string) => request<Reservation>(`${API_PATHS.reservations}/${id}/cancel`, { method: "PATCH" })
};
