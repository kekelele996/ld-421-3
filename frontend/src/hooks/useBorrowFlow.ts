import { borrowApi } from "../api/borrow";
import type { BorrowRecord } from "../types/borrow";

export function useBorrowFlow() {
  return {
    submit: (payload: Partial<BorrowRecord>) => borrowApi.create(payload),
    approve: (id: string) => borrowApi.approve(id, true),
    reject: (id: string) => borrowApi.approve(id, false),
    confirmReturn: (id: string) => borrowApi.confirmReturn(id)
  };
}
