import { Steps } from "antd";

export function StepIndicator({ current }: { current: number }) {
  return <Steps size="small" current={current} items={[{ title: "申请" }, { title: "审批" }, { title: "使用" }, { title: "归还" }]} />;
}
