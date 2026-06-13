import { CalendarCell } from "../components/common/CalendarCell";
import { StatusBadge } from "../components/common/StatusBadge";

export function ReservationManage() {
  return <section><CalendarCell title="HPLC" status="warning" time="14:00" /><StatusBadge value="Approved" /></section>;
}
