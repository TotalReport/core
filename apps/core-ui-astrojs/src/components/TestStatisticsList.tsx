import { useState } from "react";
import { 
  ENTITY_TYPES, 
  type TestEntityCount, 
  type Status, 
  type StatusGroup,
  filterStatsByEntityType,
  organizeStatsByEntityType
} from "../lib/test-statistics-utils";
import { EntityTypeSection } from "./test-statistics/EntityTypeSection";

export type TestStatisticsListProps = {
  testEntityStats: TestEntityCount[];
  statuses: Status[];
  statusGroups: StatusGroup[];
};

export const TestStatisticsList = ({
  testEntityStats,
  statuses,
  statusGroups,
}: TestStatisticsListProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedEntityTypes, setExpandedEntityTypes] = useState<Record<string, boolean>>({
    test: true,
    beforeTest: true,
    afterTest: true
  });

  // Toggle expansion handlers
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const toggleEntityType = (entityType: string) => {
    setExpandedEntityTypes(prev => ({
      ...prev,
      [entityType]: !prev[entityType]
    }));
  };

  // Filter and organize stats
  const filteredStats = filterStatsByEntityType(testEntityStats);
  const organizedStatsByType = organizeStatsByEntityType(filteredStats, statuses, statusGroups);

  return (
    <div className="border rounded-md">
      <ul className="divide-y">
        {ENTITY_TYPES.map(entityType => (
          <EntityTypeSection
            key={entityType}
            entityType={entityType}
            organizedStats={organizedStatsByType[entityType]}
            isExpanded={!!expandedEntityTypes[entityType]}
            onToggle={() => toggleEntityType(entityType)}
            expandedGroups={expandedGroups}
            onGroupToggle={toggleGroup}
          />
        ))}
      </ul>
    </div>
  );
};
