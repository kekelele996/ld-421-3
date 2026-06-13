import { borrowRecords, equipment, maintenanceRecords, reservations } from "../database/seeds/seed.ts";
import { BorrowStatus } from "../types/enums.ts";

export const dashboardService = {
  summary() {
    const byStatus = equipment.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] ?? 0) + 1;
      return acc;
    }, {});
    const borrowTop = equipment.map((item) => ({
      equipmentId: item.id,
      equipmentName: item.name,
      count: borrowRecords.filter((record) => record.equipmentId === item.id).length
    })).sort((a, b) => b.count - a.count).slice(0, 10);
    const warrantyAlerts = equipment.filter((item) => new Date(item.warrantyExpiresAt).getTime() < Date.now() + 120 * 86400000);
    return {
      stats: {
        totalEquipment: equipment.length,
        pendingBorrow: borrowRecords.filter((record) => record.status === BorrowStatus.Pending).length,
        pendingReservation: reservations.filter((record) => record.status === "Pending").length,
        maintenanceDue: maintenanceRecords.filter((record) => new Date(record.nextMaintenanceDate).getTime() < Date.now() + 30 * 86400000).length
      },
      byStatus,
      borrowTop,
      warrantyAlerts
    };
  }
};
