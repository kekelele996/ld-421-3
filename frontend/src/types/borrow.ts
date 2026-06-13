import type { BorrowStatus, ReturnCondition } from "./enums";

export type BorrowRecord = {
  id: string;
  equipmentId: string;
  borrowerId: string;
  borrowedAt: string;
  expectedReturnAt: string;
  actualReturnAt?: string;
  purpose: string;
  status: BorrowStatus;
  approverId?: string;
  returnCondition?: ReturnCondition;
};
