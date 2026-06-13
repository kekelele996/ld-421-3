import { API_PATHS } from "../constants/apiPaths";
import { request } from "../utils/request";
import type { MaintenanceRecord } from "../types/maintenance";

export const maintenanceApi = {
  list: () => request<{ records: MaintenanceRecord[]; stats: { totalCost: number; upcoming: MaintenanceRecord[] } }>(API_PATHS.maintenance),
  create: (payload: Partial<MaintenanceRecord>) => request<MaintenanceRecord>(API_PATHS.maintenance, { method: "POST", body: JSON.stringify(payload) })
};
