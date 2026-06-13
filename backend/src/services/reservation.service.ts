import { reservations } from "../database/seeds/seed.ts";
import type { Reservation } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";

export const reservationService = {
  list(equipmentId = "") {
    return equipmentId ? reservations.filter((record) => record.equipmentId === equipmentId) : reservations;
  },
  create(input: Partial<Reservation>) {
    if (!input.equipmentId || !input.startsAt || !input.endsAt) throw new ApiError(400, "RESERVATION_INVALID", "设备和时间段必填");
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
