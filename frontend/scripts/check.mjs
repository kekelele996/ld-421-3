import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const required = [
  "src/api/equipment.ts",
  "src/api/borrow.ts",
  "src/api/maintenance.ts",
  "src/api/reservation.ts",
  "src/api/category.ts",
  "src/stores/equipmentStore.ts",
  "src/stores/borrowStore.ts",
  "src/stores/maintenanceStore.ts",
  "src/stores/reservationStore.ts",
  "src/types/enums.ts",
  "src/components/common/StatusBadge.tsx",
  "src/components/common/CalendarCell.tsx",
  "src/components/common/StatCard.tsx",
  "src/components/common/StepIndicator.tsx",
  "src/components/common/AlertBanner.tsx",
  "src/hooks/useBorrowFlow.ts",
  "src/hooks/usePagination.ts",
  "src/pages/Dashboard.tsx",
  "src/pages/EquipmentManage.tsx",
  "src/pages/BorrowManage.tsx",
  "src/pages/ReservationManage.tsx",
  "src/pages/MaintenanceManage.tsx",
  "src/router/index.tsx",
  "src/router/guards.tsx",
  "src/utils/formatCurrency.ts",
  "src/utils/request.ts",
  "src/constants/apiPaths.ts"
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length) {
  console.error(`Missing required files:\n${missing.join("\n")}`);
  process.exit(1);
}

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const sourceCount = files("src").filter((file) => /\.(ts|tsx|js)$/.test(file)).length;
if (sourceCount < 30) {
  console.error(`Expected split source files, found ${sourceCount}`);
  process.exit(1);
}
console.log(`frontend structure check passed with ${sourceCount} source files`);
