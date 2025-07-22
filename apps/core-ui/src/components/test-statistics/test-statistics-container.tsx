"use client";

import {
  ENTITY_TYPES,
  type TestEntityCount,
  type Status,
  type StatusGroup,
} from "@/lib/test-statistics-utils.js";
import { EntityTypeSection } from "./entity-type-section.jsx";
import { useTestStatistics } from "@/hooks/use-test-statistics.js";
import { useFindTestEntitiesStatusesCounts } from "@/hooks/api/test-entities/use-find-test-entities-statuses-counts.js";
import { useFindStatuses } from "@/hooks/api/statuses/use-find-statuses.jsx";
import { useFindStatusGroups } from "@/hooks/api/status-groups/use-find-statuses-groups.jsx";

export type TestsStatisticsContainerProps = {
  reportId?: number;
  launchId?: number;
};

export const TestsStatisticsContainer = ({
  reportId,
  launchId,
}: TestsStatisticsContainerProps) => {
  const testEntitiesStatusesCountsResponse = useFindTestEntitiesStatusesCounts({
    filters: {
      reportId,
      launchId,
      distinct: true,
    },
  });

  const statusGroupsResponse = useFindStatusGroups();
  const statusesResponse = useFindStatuses();
 
  const isError = testEntitiesStatusesCountsResponse.isError ||
    statusGroupsResponse.isError ||
    statusesResponse.isError;

  const isPending = testEntitiesStatusesCountsResponse.isPending ||
    statusGroupsResponse.isPending ||
    statusesResponse.isPending;

  // Get organized statistics and expansion state from our custom hook
  const {
    expandedGroups,
    expandedEntityTypes,
    toggleGroup,
    toggleEntityType,
    organizedStatsByType,
  } = useTestStatistics({
    testEntityStats : isPending || isError ? [] : testEntitiesStatusesCountsResponse.data,
    statuses: isPending || isError ? [] : statusesResponse.data.items,
    statusGroups: isPending || isError ? [] : statusGroupsResponse.data.items,
  });

  if (isError) {
    return <div>Error loading test statistics</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border rounded-md">
      <ul className="divide-y">
        {ENTITY_TYPES.map((entityType) => (
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
