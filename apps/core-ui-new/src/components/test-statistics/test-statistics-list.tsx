'use client';

import { 
  ENTITY_TYPES,
  type TestEntityCount, 
  type Status, 
  type StatusGroup
} from "@/lib/test-statistics-utils";
import { EntityTypeSection } from "./entity-type-section";
import { useTestStatistics } from "@/hooks/test-statistics/use-test-statistics";

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
  // Get organized statistics and expansion state from our custom hook
  const { 
    expandedGroups, 
    expandedEntityTypes, 
    toggleGroup, 
    toggleEntityType,
    organizedStatsByType
  } = useTestStatistics({
    testEntityStats,
    statuses,
    statusGroups
  });

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
