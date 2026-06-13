import { create } from "zustand";
import { borrowApi } from "../api/borrow";
import type { BorrowRecord } from "../types/borrow";

type State = { items: BorrowRecord[]; load: (status?: string) => Promise<void> };
export const useBorrowStore = create<State>((set) => ({
  items: [],
  load: async (status = "") => set({ items: await borrowApi.list(status) })
}));
