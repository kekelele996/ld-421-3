import { AlertBanner } from "../components/common/AlertBanner";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";

export function Dashboard() {
  return <section><AlertBanner message="关注过保、逾期和待审批事项" /><StatCard title="设备总数" value={3} /><StatusBadge value="Pending" /></section>;
}
