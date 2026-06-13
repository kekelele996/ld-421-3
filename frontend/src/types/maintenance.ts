import type { MaintenanceType } from "./enums";

export type MaintenanceRecord = {
  id: string;
  equipmentId: string;
  type: MaintenanceType;
  content: string;
  maintenanceDate: string;
  nextMaintenanceDate: string;
  cost: number;
  maintainerId: string;
  result: "Pass" | "Fail" | "NeedsFollowUp";
};
