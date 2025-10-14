import { ChevronDown, ChevronRight } from "lucide-react";
import { StatusGroupDetail } from "./status-group-detail.jsx";
import { StatusGroupCountSummary } from "./status-group-count-summary.jsx";
import { useState } from "react";

export type EntityTypeSectionProps = {
  /**
   * The type of entity (test, beforeTest, or afterTest)
   */
  entityType: "test" | "beforeTest" | "afterTest";
  /**
   * Map of status group IDs to maps of status IDs to their counts.
   */
  counts: Map<string | null, Map<string | null, number>>;
};

export const EntityTypeSection = ({
  entityType,
  counts
}: EntityTypeSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayName = ENTITY_TYPE_LABELS[entityType];

  return (
    <div className="p-3">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <ExpandableChevron isExpanded={isExpanded} />
          <span className="font-medium">{displayName}</span>
        </div>
        <div className="flex items-center gap-2">
          {Array.from(counts.entries()).map(([groupId, groupData]) => (
            <StatusGroupCountSummary
              key={`${entityType}-group-${groupId}`}
              groupId={groupId}
              count={groupData.size === 0 ? 0 : Array.from(groupData.values()).reduce((a, b) => a + b, 0)}
            />
          ))}
        </div>
      </div>

      {isExpanded && counts.size > 0 && (
        <div className="mt-2 pl-6">
          <ul className="space-y-2">
            {Array.from(counts.entries()).map(([groupId, groupCounts]) => (
              <li key={`${entityType}-${groupId}`}>
                <StatusGroupDetail
                  groupId={groupId}
                  counts={groupCounts}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {isExpanded && counts.size === 0 && (
        <div className="mt-2 pl-6">
          <p className="text-sm text-muted-foreground">
            No {displayName.toLowerCase()} data
          </p>
        </div>
      )}
    </div>
  );
};

const ExpandableChevron = ({ isExpanded }: { isExpanded: boolean }) => {
  return isExpanded ? (
    <ChevronDown className="h-4 w-4 mr-1" />
  ) : (
    <ChevronRight className="h-4 w-4 mr-1" />
  );
};

const ENTITY_TYPE_LABELS = {
  test: "Tests",
  beforeTest: "Before Tests",
  afterTest: "After Tests",
} as const;
