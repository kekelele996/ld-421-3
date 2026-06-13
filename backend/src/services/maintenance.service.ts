import { maintenanceRecords, equipment } from "../database/seeds/seed.ts";
import { AssetStatus, MaintenanceType } from "../types/enums.ts";
import type { MaintenanceRecord } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";

export const maintenanceService = {
  list() {
    return maintenanceRecords;
  },
  create(input: Partial<MaintenanceRecord>) {
    if (!input.equipmentId) throw new ApiError(400, "EQUIPMENT_REQUIRED", "必须选择维护设备");
    const record: MaintenanceRecord = {
      id: `mt-${Date.now()}`,
      equipmentId: input.equipmentId,
      type: input.type ?? MaintenanceType.Preventive,
      content: input.content ?? "例行维护",
      maintenanceDate: input.maintenanceDate ?? new Date().toISOString().slice(0, 10),
      nextMaintenanceDate: input.nextMaintenanceDate ?? new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      cost: Number(input.cost ?? 0),
      maintainerId: input.maintainerId ?? "u-manager",
      result: input.result ?? "Pass"
    };
    maintenanceRecords.unshift(record);
    const item = equipment.find((entry) => entry.id === record.equipmentId);
    if (item) item.status = record.result === "NeedsFollowUp" ? AssetStatus.Maintenance : AssetStatus.Available;
    return record;
  },
  stats() {
    return {
      totalCost: maintenanceRecords.reduce((sum, record) => sum + record.cost, 0),
      upcoming: maintenanceRecords.filter((record) => new Date(record.nextMaintenanceDate).getTime() < Date.now() + 30 * 86400000)
    };
  }
};
