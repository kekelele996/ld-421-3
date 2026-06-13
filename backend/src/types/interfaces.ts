import type { AssetStatusValue, BorrowStatusValue, MaintenanceTypeValue, ReturnConditionValue, UserRole } from "./enums.ts";

export type User = {
  id: string;
  name: string;
  role: UserRole;
};

export type EquipmentCategory = {
  id: string;
  name: string;
  parentId?: string;
  description: string;
  icon: string;
};

export type Equipment = {
  id: string;
  name: string;
  equipmentNo: string;
  categoryId: string;
  brandModel: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: number;
  location: string;
  status: AssetStatusValue;
  ownerId: string;
  supplier: string;
  warrantyExpiresAt: string;
  imageUrl: string;
};

export type BorrowRecord = {
  id: string;
  equipmentId: string;
  borrowerId: string;
  borrowedAt: string;
  expectedReturnAt: string;
  actualReturnAt?: string;
  purpose: string;
  status: BorrowStatusValue;
  approverId?: string;
  returnCondition?: ReturnConditionValue;
};

export type MaintenanceRecord = {
  id: string;
  equipmentId: string;
  type: MaintenanceTypeValue;
  content: string;
  maintenanceDate: string;
  nextMaintenanceDate: string;
  cost: number;
  maintainerId: string;
  result: "Pass" | "Fail" | "NeedsFollowUp";
};

export type Reservation = {
  id: string;
  equipmentId: string;
  reserverId: string;
  startsAt: string;
  endsAt: string;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected" | "Cancelled";
  approverId?: string;
};

export type AuditLog = {
  id: string;
  actorId: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
};
