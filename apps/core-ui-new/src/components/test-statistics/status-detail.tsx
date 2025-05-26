"use client";

import type { StatusWithCount } from "@/lib/test-statistics-utils";
import { StatusDot } from "./status-dot";

export type StatusDetailProps = {
  statusItem: StatusWithCount;
};

export const StatusDetail = ({ statusItem }: StatusDetailProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <StatusDot
          color={statusItem.status?.color}
          size="w-2 h-2"
          title={statusItem.status?.title}
        />
        <span className="text-sm">{statusItem.status?.title || "Not set"}</span>
      </div>
      <span className="text-sm font-medium">{statusItem.count}</span>
    </div>
  );
};
