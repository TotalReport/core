import type { StatusWithCount } from "../../lib/test-statistics-utils";
import { StatusDot } from "./StatusDot";

export type StatusDetailProps = {
  statusItem: StatusWithCount
};

export const StatusDetail = ({
  statusItem
}: StatusDetailProps) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center">
      <StatusDot 
        color={statusItem.status?.color} 
        size="w-2 h-2 mr-2" 
      />
      <span>{statusItem.status?.title || "Not set"}</span>
    </div>
    <span className="text-sm font-medium">{statusItem.count}</span>
  </div>
);