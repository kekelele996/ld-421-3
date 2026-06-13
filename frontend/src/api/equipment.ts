import { API_PATHS } from "../constants/apiPaths";
import { request } from "../utils/request";
import type { Equipment } from "../types/equipment";
import type { TimelineEvent } from "../types/reservation";

export const equipmentApi = {
  list: (search = "") => request<Equipment[]>(`${API_PATHS.equipment}?search=${encodeURIComponent(search)}`),
  create: (payload: Partial<Equipment>) => request<Equipment>(API_PATHS.equipment, { method: "POST", body: JSON.stringify(payload) }),
  detail: (id: string) => request<Equipment>(`${API_PATHS.equipment}/${id}`),
  timeline: (id: string) => request<TimelineEvent[]>(`${API_PATHS.equipment}/${id}/timeline`)
};
