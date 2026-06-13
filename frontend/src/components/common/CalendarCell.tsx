import { Badge } from "antd";

export function CalendarCell({ title, status, time }: { title: string; status: string; time: string }) {
  return <Badge status={status === "Approved" ? "success" : "warning"} text={`${time} ${title}`} />;
}
