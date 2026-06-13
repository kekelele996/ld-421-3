import { Badge, Tag } from "antd";
import type { TimelineEvent } from "../../types/reservation";

const typeColorMap: Record<TimelineEvent["type"], string> = {
  borrow: "orange",
  maintenance: "red",
  reservation: "blue"
};

const typeLabelMap: Record<TimelineEvent["type"], string> = {
  borrow: "借用",
  maintenance: "维保",
  reservation: "预约"
};

export function CalendarCell({ title, status, time }: { title: string; status: string; time: string }) {
  return <Badge status={status === "Approved" ? "success" : "warning"} text={`${time} ${title}`} />;
}

export function TimelineEventCell({ event }: { event: TimelineEvent }) {
  const color = typeColorMap[event.type];
  const label = typeLabelMap[event.type];
  const startsAt = new Date(event.startsAt);
  const startStr = `${startsAt.toLocaleDateString("zh-CN")} ${startsAt.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
  const dateStr = event.endsAt
    ? `${startStr} - ${new Date(event.endsAt).toLocaleDateString("zh-CN")} ${new Date(event.endsAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`
    : `${startStr} 起，维保进行中`;
  return (
    <div style={{ padding: "4px 0" }}>
      <Tag color={color} style={{ marginRight: 4 }}>{label}</Tag>
      <span style={{ fontSize: 13 }}>{event.title}</span>
      <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{dateStr}</div>
    </div>
  );
}
