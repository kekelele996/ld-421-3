import { create } from "zustand";
import { reservationApi } from "../api/reservation";
import type { Reservation } from "../types/reservation";

type State = { items: Reservation[]; load: (equipmentId?: string) => Promise<void> };
export const useReservationStore = create<State>((set) => ({
  items: [],
  load: async (equipmentId = "") => set({ items: await reservationApi.list(equipmentId) })
}));
