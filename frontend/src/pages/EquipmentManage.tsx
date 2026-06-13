import { CalendarCell } from "../components/common/CalendarCell";
import { StatusBadge } from "../components/common/StatusBadge";

export function EquipmentManage() {
  return <section><StatusBadge value="Available" /><CalendarCell title="显微镜预约" status="Approved" time="09:00" /></section>;
}
