import { create } from "zustand";
import { maintenanceApi } from "../api/maintenance";
import type { MaintenanceRecord } from "../types/maintenance";

type State = { records: MaintenanceRecord[]; totalCost: number; load: () => Promise<void> };
export const useMaintenanceStore = create<State>((set) => ({
  records: [],
  totalCost: 0,
  load: async () => {
    const data = await maintenanceApi.list();
    set({ records: data.records, totalCost: data.stats.totalCost });
  }
}));
