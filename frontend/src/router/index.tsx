import { Dashboard } from "../pages/Dashboard";
import { EquipmentManage } from "../pages/EquipmentManage";
import { BorrowManage } from "../pages/BorrowManage";
import { ReservationManage } from "../pages/ReservationManage";
import { MaintenanceManage } from "../pages/MaintenanceManage";

export const routes = [
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/equipment", element: <EquipmentManage /> },
  { path: "/borrow", element: <BorrowManage /> },
  { path: "/reservations", element: <ReservationManage /> },
  { path: "/maintenance", element: <MaintenanceManage /> }
];
