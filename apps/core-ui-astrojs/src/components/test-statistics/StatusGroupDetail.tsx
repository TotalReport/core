import { ChevronDown, ChevronRight } from "lucide-react";
import type { GroupedStatusData } from "../../lib/test-statistics-utils";
import { StatusDot } from "./StatusDot";
import { StatusDetail } from "./StatusDetail";

export type StatusGroupDetailProps = { 
  groupData: GroupedStatusData;
  isExpanded: boolean;
  onToggle: () => void;
};

export const StatusGroupDetail = ({
  groupData, 
  isExpanded,
  onToggle
}: StatusGroupDetailProps) => {
  const hasUndefinedColor = groupData.statuses.some(item => !item.status?.color);
  
  return (
    <li>
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={onToggle}
      >
        <div className="flex items-center">
          {isExpanded ? 
            <ChevronDown className="h-4 w-4 mr-1" /> : 
            <ChevronRight className="h-4 w-4 mr-1" />}
          <StatusDot 
            color={hasUndefinedColor ? null : groupData.group.color} 
            size="w-3 h-3 mr-2" 
          />
          <span>{groupData.group.title}</span>
        </div>
        <div className="flex items-center gap-2">
          {groupData.statuses.map((item, idx) => (
            <div key={idx} className="flex items-center">
              <StatusDot 
                color={item.status?.color} 
                title={item.status?.title || "Not set"} 
              />
              <span className="text-sm font-medium">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
      
      {isExpanded && (
        <div className="pl-6 mt-1 space-y-1">
          {groupData.statuses.map((item, idx) => (
            <StatusDetail key={idx} statusItem={item} />
          ))}
        </div>
      )}
    </li>
  );
};