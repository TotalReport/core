import { useState, useMemo } from "react";
import { 
  type TestEntityCount, 
  type Status, 
  type StatusGroup,
  groupStatsByEntityType,
  organizeStatsByEntityType
} from "@/lib/test-statistics-utils.js";

type UseTestStatisticsProps = {
  testEntityStats: TestEntityCount[];
  statuses: Status[];
  statusGroups: StatusGroup[];
};

export const useTestStatistics = ({
  testEntityStats,
  statuses,
  statusGroups,
}: UseTestStatisticsProps) => {
  // State for tracking which groups and entity types are expanded
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedEntityTypes, setExpandedEntityTypes] = useState<Record<string, boolean>>({
    test: true,        // Default to expanded for main test items
    beforeTest: true,  // Default to expanded for before test items
    afterTest: true    // Default to expanded for after test items
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

  // Memoize the filtered and organized stats to prevent unnecessary recalculations
  const organizedStatsByType = useMemo(() => {
    const groupedStats = groupStatsByEntityType(testEntityStats);
    return organizeStatsByEntityType(groupedStats, statuses, statusGroups);
  }, [testEntityStats, statuses, statusGroups]);

  return {
    expandedGroups,
    expandedEntityTypes,
    toggleGroup,
    toggleEntityType,
    organizedStatsByType
  };
};
