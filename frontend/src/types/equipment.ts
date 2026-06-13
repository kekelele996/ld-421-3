import type { AssetStatus } from "./enums";

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
  status: AssetStatus;
  ownerId: string;
  supplier: string;
  warrantyExpiresAt: string;
  imageUrl: string;
};

export type EquipmentCategory = {
  id: string;
  name: string;
  parentId?: string;
  description: string;
  icon: string;
};
