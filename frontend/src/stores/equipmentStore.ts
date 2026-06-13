import { create } from "zustand";
import { equipmentApi } from "../api/equipment";
import type { Equipment } from "../types/equipment";

type State = { items: Equipment[]; load: (search?: string) => Promise<void> };
export const useEquipmentStore = create<State>((set) => ({
  items: [],
  load: async (search = "") => set({ items: await equipmentApi.list(search) })
}));
