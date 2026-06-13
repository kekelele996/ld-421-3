import { Tag } from "antd";

const colorMap: Record<string, string> = {
  Available: "green",
  Approved: "green",
  Returned: "green",
  Pending: "gold",
  InUse: "blue",
  Maintenance: "orange",
  Rejected: "red",
  Lost: "red"
};

export function StatusBadge({ value }: { value: string }) {
  return <Tag color={colorMap[value] ?? "default"}>{value}</Tag>;
}
