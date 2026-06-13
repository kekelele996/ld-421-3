import { Card, Statistic } from "antd";

export function StatCard({ title, value }: { title: string; value: number | string }) {
  return <Card size="small"><Statistic title={title} value={value} /></Card>;
}
