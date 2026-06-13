import { CalendarCell } from "../components/common/CalendarCell";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";

export function MaintenanceManage() {
  return <section><StatCard title="维护费用" value={4800} /><CalendarCell title="校准" status="warning" time="周五" /><StatusBadge value="NeedsFollowUp" /></section>;
}
