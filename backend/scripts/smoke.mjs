import { strict as assert } from "node:assert";
import { dashboardService } from "../src/services/dashboard.service.ts";
import { equipmentRoutes } from "../src/routes/equipment.routes.ts";
import { borrowRoutes } from "../src/routes/borrow.routes.ts";
import { reservationRoutes } from "../src/routes/reservation.routes.ts";
import { maintenanceRoutes } from "../src/routes/maintenance.routes.ts";
import { categoryRoutes } from "../src/routes/category.routes.ts";
import { auditLogs } from "../src/database/seeds/seed.ts";

const manager = { id: "u-manager", name: "实验室经理 林", role: "LabManager" };
const query = new URLSearchParams();

const dashboard = dashboardService.summary();
assert.equal(dashboard.stats.totalEquipment >= 3, true);

const categories = categoryRoutes("GET", "/api/categories");
assert.equal(Array.isArray(categories), true);

const equipment = equipmentRoutes("GET", "/api/equipment", query, manager, {});
assert.equal(equipment.length >= 3, true);

const newEquipment = equipmentRoutes("POST", "/api/equipment", query, manager, {
  name: "烟雾测试设备",
  equipmentNo: "LAB-SMOKE-001",
  purchasePrice: 1000
});
assert.equal(newEquipment.name, "烟雾测试设备");

const borrow = borrowRoutes("POST", "/api/borrow", query, manager, {
  equipmentId: equipment[0].id,
  purpose: "smoke borrow"
});
assert.equal(borrow.status, "Pending");

const approvedBorrow = borrowRoutes("PATCH", `/api/borrow/${borrow.id}/approve`, query, manager, { approved: true });
assert.equal(approvedBorrow.status, "Approved");

const returnedBorrow = borrowRoutes("PATCH", `/api/borrow/${borrow.id}/return`, query, manager, { condition: "Good" });
assert.equal(returnedBorrow.status, "Returned");

const reservation = reservationRoutes("POST", "/api/reservations", query, manager, {
  equipmentId: equipment[0].id,
  startsAt: "2026-06-16T09:00:00+08:00",
  endsAt: "2026-06-16T11:00:00+08:00"
});
assert.equal(reservation.status, "Pending");

const maintenance = maintenanceRoutes("POST", "/api/maintenance", query, manager, {
  equipmentId: equipment[0].id,
  type: "Cleaning",
  content: "smoke maintenance"
});
assert.equal(maintenance.result, "Pass");
assert.equal(auditLogs.length >= 5, true);

console.log("ld-421 backend route smoke passed");
