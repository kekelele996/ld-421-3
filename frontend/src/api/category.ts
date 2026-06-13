import { API_PATHS } from "../constants/apiPaths";
import { request } from "../utils/request";
import type { EquipmentCategory } from "../types/equipment";

export const categoryApi = {
  tree: () => request<EquipmentCategory[]>(API_PATHS.categories)
};
