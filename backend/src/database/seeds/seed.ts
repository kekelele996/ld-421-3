import { AssetStatus, BorrowStatus, MaintenanceType, ReturnCondition } from "../../types/enums.ts";
import type { AuditLog, BorrowRecord, Equipment, EquipmentCategory, MaintenanceRecord, Reservation, User } from "../../types/interfaces.ts";

export const users: User[] = [
  { id: "u-admin", name: "管理员 高", role: "Admin" },
  { id: "u-manager", name: "实验室经理 林", role: "LabManager" },
  { id: "u-researcher", name: "研究员 周", role: "Researcher" },
  { id: "u-student", name: "学生 陈", role: "Student" }
];

export const categories: EquipmentCategory[] = [
  { id: "cat-analysis", name: "分析仪器", description: "色谱、质谱、光谱设备", icon: "experiment" },
  { id: "cat-optics", name: "光学设备", parentId: "cat-analysis", description: "显微与成像设备", icon: "aperture" },
  { id: "cat-safety", name: "安全设备", description: "通风、灭菌和防护设备", icon: "shield" }
];

export const equipment: Equipment[] = [
  {
    id: "eq-hplc-01",
    name: "高效液相色谱仪",
    equipmentNo: "LAB-HPLC-2024-001",
    categoryId: "cat-analysis",
    brandModel: "Agilent 1260 Infinity II",
    serialNumber: "SN-HPLC-88421",
    purchaseDate: "2024-04-18",
    purchasePrice: 428000,
    location: "理科楼-B214-3号柜",
    status: AssetStatus.InUse,
    ownerId: "u-manager",
    supplier: "华东科学仪器",
    warrantyExpiresAt: "2027-04-18",
    imageUrl: "https://images.unsplash.com/photo-1581093458791-9d42cc030ed2"
  },
  {
    id: "eq-micro-02",
    name: "倒置荧光显微镜",
    equipmentNo: "LAB-MIC-2023-014",
    categoryId: "cat-optics",
    brandModel: "Nikon Ti2-U",
    serialNumber: "SN-MIC-55102",
    purchaseDate: "2023-10-02",
    purchasePrice: 315000,
    location: "生命楼-A502-显微平台",
    status: AssetStatus.Available,
    ownerId: "u-researcher",
    supplier: "尼康中国",
    warrantyExpiresAt: "2026-10-02",
    imageUrl: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55"
  },
  {
    id: "eq-sterile-03",
    name: "高压灭菌锅",
    equipmentNo: "LAB-STE-2021-007",
    categoryId: "cat-safety",
    brandModel: "Panasonic MLS-3781L",
    serialNumber: "SN-STE-12077",
    purchaseDate: "2021-03-12",
    purchasePrice: 68000,
    location: "公共平台-C109-清洗间",
    status: AssetStatus.Maintenance,
    ownerId: "u-manager",
    supplier: "松下医疗",
    warrantyExpiresAt: "2026-07-01",
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd"
  }
];

export const borrowRecords: BorrowRecord[] = [
  { id: "br-001", equipmentId: "eq-hplc-01", borrowerId: "u-researcher", borrowedAt: "2026-06-01", expectedReturnAt: "2026-06-16", purpose: "药物代谢样品检测", status: BorrowStatus.Approved, approverId: "u-manager" },
  { id: "br-002", equipmentId: "eq-micro-02", borrowerId: "u-student", borrowedAt: "2026-06-10", expectedReturnAt: "2026-06-12", purpose: "细胞成像训练", status: BorrowStatus.Pending },
  { id: "br-003", equipmentId: "eq-sterile-03", borrowerId: "u-student", borrowedAt: "2026-05-20", expectedReturnAt: "2026-05-22", actualReturnAt: "2026-05-23", purpose: "培养基灭菌", status: BorrowStatus.Returned, approverId: "u-manager", returnCondition: ReturnCondition.Good }
];

export const maintenanceRecords: MaintenanceRecord[] = [
  { id: "mt-001", equipmentId: "eq-hplc-01", type: MaintenanceType.Calibration, content: "流量准确性校准，替换密封圈", maintenanceDate: "2026-05-22", nextMaintenanceDate: "2026-08-22", cost: 3600, maintainerId: "u-manager", result: "Pass" },
  { id: "mt-002", equipmentId: "eq-sterile-03", type: MaintenanceType.Corrective, content: "压力阀异常，等待供应商二次检测", maintenanceDate: "2026-06-09", nextMaintenanceDate: "2026-06-15", cost: 1200, maintainerId: "u-manager", result: "NeedsFollowUp" }
];

export const reservations: Reservation[] = [
  { id: "rs-001", equipmentId: "eq-micro-02", reserverId: "u-researcher", startsAt: "2026-06-13T09:00:00+08:00", endsAt: "2026-06-13T12:00:00+08:00", purpose: "免疫荧光图片采集", status: "Approved", approverId: "u-manager" },
  { id: "rs-002", equipmentId: "eq-hplc-01", reserverId: "u-student", startsAt: "2026-06-14T14:00:00+08:00", endsAt: "2026-06-14T17:30:00+08:00", purpose: "标准曲线复测", status: "Pending" }
];

export const auditLogs: AuditLog[] = [
  { id: "log-001", actorId: "u-manager", action: "APPROVE_BORROW", entity: "BorrowRecord", entityId: "br-001", createdAt: "2026-06-01T10:11:00+08:00" },
  { id: "log-002", actorId: "u-manager", action: "CREATE_MAINTENANCE", entity: "MaintenanceRecord", entityId: "mt-002", createdAt: "2026-06-09T15:40:00+08:00" }
];
