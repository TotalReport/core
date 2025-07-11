'use client';

import type { GroupedStatusData } from "@/lib/test-statistics-utils.js";
import { StatusDot } from "./status-dot.js";

export type StatusGroupSummaryProps = { 
  groupData: GroupedStatusData; 
};

export const StatusGroupSummary = ({ groupData }: StatusGroupSummaryProps) => {
  const hasUndefinedColor = groupData.statuses.some(item => !item.status?.color);
  
  return (
    <div className="flex items-center">
      <StatusDot 
        color={hasUndefinedColor ? null : groupData.group.color} 
        title={groupData.group.title}
      />
      <span className="text-sm font-medium">{groupData.totalCount}</span>
    </div>
  );
};
