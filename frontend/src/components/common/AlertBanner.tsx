import { Alert } from "antd";

export function AlertBanner({ message }: { message: string }) {
  return <Alert type="warning" showIcon message={message} />;
}
