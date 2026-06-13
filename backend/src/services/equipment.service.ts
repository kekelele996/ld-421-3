import { equipment, categories, borrowRecords, maintenanceRecords, reservations } from "../database/seeds/seed.ts";
import { AssetStatus } from "../types/enums.ts";
import type { Equipment } from "../types/interfaces.ts";
import { ApiError } from "../utils/response.ts";

export const equipmentService = {
  list(search = "", categoryId = "") {
    const keyword = search.toLowerCase();
    return equipment.filter((item) => {
      const matchesSearch = !keyword || [item.name, item.equipmentNo, item.brandModel, item.location].some((value) => value.toLowerCase().includes(keyword));
      const matchesCategory = !categoryId || item.categoryId === categoryId;
      return matchesSearch && matchesCategory;
    });
  },
  detail(id: string) {
    const item = equipment.find((entry) => entry.id === id);
    if (!item) throw new ApiError(404, "EQUIPMENT_NOT_FOUND", "设备不存在");
    return {
      ...item,
      category: categories.find((category) => category.id === item.categoryId),
      borrowHistory: borrowRecords.filter((record) => record.equipmentId === id),
      maintenanceHistory: maintenanceRecords.filter((record) => record.equipmentId === id),
      reservationCalendar: reservations.filter((record) => record.equipmentId === id)
    };
  },
  create(input: Partial<Equipment>) {
    const item: Equipment = {
      id: `eq-${Date.now()}`,
      name: input.name ?? "新设备",
      equipmentNo: input.equipmentNo ?? `LAB-${Date.now()}`,
      categoryId: input.categoryId ?? categories[0].id,
      brandModel: input.brandModel ?? "待补充",
      serialNumber: input.serialNumber ?? "待登记",
      purchaseDate: input.purchaseDate ?? new Date().toISOString().slice(0, 10),
      purchasePrice: Number(input.purchasePrice ?? 0),
      location: input.location ?? "未分配",
      status: input.status ?? AssetStatus.Available,
      ownerId: input.ownerId ?? "u-manager",
      supplier: input.supplier ?? "待补充",
      warrantyExpiresAt: input.warrantyExpiresAt ?? "2027-12-31",
      imageUrl: input.imageUrl ?? ""
    };
    equipment.unshift(item);
    return item;
  },
  retire(id: string) {
    const item = this.detail(id) as Equipment;
    item.status = AssetStatus.Retired;
    return item;
  },
  transferOwner(id: string, ownerId: string) {
    const item = this.detail(id) as Equipment;
    item.ownerId = ownerId;
    return item;
  }
};
