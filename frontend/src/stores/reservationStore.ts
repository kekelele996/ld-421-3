import { create } from "zustand";
import { reservationApi } from "../api/reservation";
import type { Reservation, ConflictItem } from "../types/reservation";

type State = {
  items: Reservation[];
  conflicts: ConflictItem[];
  loading: boolean;
  load: (equipmentId?: string) => Promise<void>;
  checkConflicts: (equipmentId: string, startsAt: string, endsAt: string) => Promise<ConflictItem[]>;
  create: (payload: Partial<Reservation>) => Promise<Reservation>;
  approve: (id: string, approved?: boolean) => Promise<Reservation>;
  cancel: (id: string) => Promise<Reservation>;
};

export const useReservationStore = create<State>((set, get) => ({
  items: [],
  conflicts: [],
  loading: false,
  load: async (equipmentId = "") => {
    set({ loading: true });
    const items = await reservationApi.list(equipmentId);
    set({ items, loading: false });
  },
  checkConflicts: async (equipmentId: string, startsAt: string, endsAt: string) => {
    const result = await reservationApi.checkConflicts(equipmentId, startsAt, endsAt);
    set({ conflicts: result.conflicts });
    return result.conflicts;
  },
  create: async (payload) => {
    set({ loading: true });
    try {
      const record = await reservationApi.create(payload);
      set((state) => ({ items: [record, ...state.items], conflicts: [], loading: false }));
      return record;
    } catch {
      set({ loading: false });
      throw new Error("预约创建失败，可能存在时间冲突");
    }
  },
  approve: async (id, approved = true) => {
    const record = await reservationApi.approve(id, approved);
    set((state) => ({ items: state.items.map((item) => (item.id === id ? record : item)) }));
    return record;
  },
  cancel: async (id) => {
    const record = await reservationApi.cancel(id);
    set((state) => ({ items: state.items.map((item) => (item.id === id ? record : item)) }));
    return record;
  }
}));
