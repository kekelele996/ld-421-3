import { StepIndicator } from "../components/common/StepIndicator";
import { StatusBadge } from "../components/common/StatusBadge";

export function BorrowManage() {
  return <section><StepIndicator current={1} /><StatusBadge value="Pending" /></section>;
}
