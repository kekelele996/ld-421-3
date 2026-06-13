import { reservations, borrowRecords, maintenanceRecords, equipment } from "../database/seeds/seed.ts";
import { AssetStatus, BorrowStatus } from "../types/enums.ts";
import type { Reservation } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";

type ConflictItem = { type: "borrow" | "maintenance" | "reservation"; id: string; startsAt: string; endsAt: string; label: string };

function intervalsOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const aS = new Date(aStart).getTime();
  const aE = new Date(aEnd).getTime();
  const bS = new Date(bStart).getTime();
  const bE = new Date(bEnd).getTime();
  return aS < bE && bS < aE;
}

export const reservationService = {
  list(equipmentId = "") {
    return equipmentId ? reservations.filter((record) => record.equipmentId === equipmentId) : reservations;
  },
  checkConflicts(equipmentId: string, startsAt: string, endsAt: string): ConflictItem[] {
    const conflicts: ConflictItem[] = [];
    const eq = equipment.find((e) => e.id === equipmentId);
    if (eq && eq.status === AssetStatus.Maintenance) {
      const ongoing = maintenanceRecords.filter((m) => m.equipmentId === equipmentId && m.result === "NeedsFollowUp");
      const m = ongoing[0];
      conflicts.push({
        type: "maintenance",
        id: m?.id ?? equipmentId,
        startsAt: m?.maintenanceDate ?? "",
        endsAt: "",
        label: `设备维保中: ${m?.content ?? "待维修"}，暂不可预约，需等维保解除`
      });
      return conflicts;
    }
    const activeBorrows = borrowRecords.filter(
      (b) => b.equipmentId === equipmentId && (b.status === BorrowStatus.Approved || b.status === BorrowStatus.Pending)
    );
    for (const b of activeBorrows) {
      if (intervalsOverlap(startsAt, endsAt, b.borrowedAt, b.expectedReturnAt)) {
        conflicts.push({ type: "borrow", id: b.id, startsAt: b.borrowedAt, endsAt: b.expectedReturnAt, label: `借用: ${b.purpose} (${b.borrowedAt} ~ ${b.expectedReturnAt})` });
      }
    }
    const activeReservations = reservations.filter(
      (r) => r.equipmentId === equipmentId && (r.status === "Approved" || r.status === "Pending")
    );
    for (const r of activeReservations) {
      if (intervalsOverlap(startsAt, endsAt, r.startsAt, r.endsAt)) {
        conflicts.push({ type: "reservation", id: r.id, startsAt: r.startsAt, endsAt: r.endsAt, label: `预约: ${r.purpose} (${r.startsAt} ~ ${r.endsAt})` });
      }
    }
    return conflicts;
  },
  create(input: Partial<Reservation>) {
    if (!input.equipmentId || !input.startsAt || !input.endsAt) throw new ApiError(400, "RESERVATION_INVALID", "设备和时间段必填");
    const conflicts = this.checkConflicts(input.equipmentId, input.startsAt, input.endsAt);
    if (conflicts.length > 0) {
      const messages = conflicts.map((c) => c.label).join("; ");
      throw new ApiError(409, "RESERVATION_CONFLICT", `时间段冲突: ${messages}`);
    }
    const record: Reservation = {
      id: `rs-${Date.now()}`,
      equipmentId: input.equipmentId,
      reserverId: input.reserverId ?? "u-student",
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      purpose: input.purpose ?? "预约使用",
      status: "Pending"
    };
    reservations.unshift(record);
    return record;
  },
  approve(id: string, approverId: string, approved = true) {
    const record = reservations.find((item) => item.id === id);
    if (!record) throw new ApiError(404, "RESERVATION_NOT_FOUND", "预约不存在");
    record.status = approved ? "Approved" : "Rejected";
    record.approverId = approverId;
    return record;
  },
  cancel(id: string) {
    const record = reservations.find((item) => item.id === id);
    if (!record) throw new ApiError(404, "RESERVATION_NOT_FOUND", "预约不存在");
    record.status = "Cancelled";
    return record;
  }
};
