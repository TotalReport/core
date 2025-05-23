import { ChevronDown, ChevronRight } from "lucide-react";
import { ENTITY_TYPE_LABELS, type GroupedStatusData } from "../../lib/test-statistics-utils";
import { StatusGroupSummary } from "./StatusGroupSummary";
import { StatusGroupDetail } from "./StatusGroupDetail";

export type EntityTypeSectionProps = {
  entityType: "test" | "beforeTest" | "afterTest";
  organizedStats: GroupedStatusData[];
  isExpanded: boolean;
  onToggle: () => void;
  expandedGroups: Record<string, boolean>;
  onGroupToggle: (groupId: string) => void;
};

export const EntityTypeSection = ({ 
  entityType, 
  organizedStats,
  isExpanded,
  onToggle,
  expandedGroups,
  onGroupToggle
}: EntityTypeSectionProps) => {
  const displayName = ENTITY_TYPE_LABELS[entityType];
  
  return (
    <li className="p-3">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={onToggle}
      >
        <div className="flex items-center">
          {isExpanded ? 
            <ChevronDown className="h-4 w-4 mr-1" /> : 
            <ChevronRight className="h-4 w-4 mr-1" />}
          <span className="font-medium">{displayName}</span>
        </div>
        <div className="flex items-center gap-2">
          {organizedStats.map((groupData) => (
            <StatusGroupSummary 
              key={`${entityType}-group-${groupData.group.id}`}
              groupData={groupData} 
            />
          ))}
        </div>
      </div>
      
      {isExpanded && organizedStats.length > 0 && (
        <div className="mt-2 pl-6">
          <ul className="space-y-2">
            {organizedStats.map(groupData => (
              <StatusGroupDetail 
                key={`${entityType}-${groupData.group.id}`}
                groupData={groupData}
                isExpanded={!!expandedGroups[`${entityType}-${groupData.group.id}`]}
                onToggle={() => onGroupToggle(`${entityType}-${groupData.group.id}`)}
              />
            ))}
          </ul>
        </div>
      )}
      
      {isExpanded && organizedStats.length === 0 && (
        <div className="mt-2 pl-6">
          <p className="text-sm text-muted-foreground">No {displayName.toLowerCase()} data</p>
        </div>
      )}
    </li>
  );
};
