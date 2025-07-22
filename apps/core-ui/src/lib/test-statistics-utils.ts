import { FindTestEntitiesStatusesCountsResponseData, TestEntityType } from "@/hooks/api/test-entities/use-find-test-entities-statuses-counts.js";

// Types
export type Status = {
  id: string;
  title: string;
  color: string;
  groupId: string;
  createdTimestamp: string;
};

export type StatusGroup = {
  id: string;
  title: string;
  color: string;
  createdTimestamp: string;
};

export type TestEntityCount = {
  entityType: "beforeTest" | "test" | "afterTest";
  statusId: string | null;
  count: number;
};

export type StatusWithCount = {
  status: Status | null;
  count: number;
};

export type GroupedStatusData = {
  group: StatusGroup;
  statuses: StatusWithCount[];
  totalCount: number;
};

// Constants
export const ENTITY_TYPE_LABELS = {
  test: "Tests",
  beforeTest: "Before Tests",
  afterTest: "After Tests",
} as const;

export const ENTITY_TYPES: ("test" | "beforeTest" | "afterTest")[] = [
  "test",
  "beforeTest",
  "afterTest",
];

// Utilities
export const getStatusBackground = (
  color?: string | null
): React.CSSProperties => {
  if (color === null || color === undefined) {
    return {
      backgroundImage: `
        linear-gradient(45deg, #ccc 25%, transparent 26%), 
        linear-gradient(-45deg, #ccc 25%, transparent 26%),
        linear-gradient(45deg, transparent 74%, #ccc 75%),
        linear-gradient(-45deg, transparent 74%, #ccc 75%)
      `,
      backgroundSize: "8px 8px",
      backgroundPosition: "1px 1px, 1px 5px, 5px -3px, -3px 0px",
      backgroundColor: "#e9e9e9",
    };
  }
  return { backgroundColor: color };
};

/**
 * Filters test entity stats by entity type
 */
export const groupStatsByEntityType = (
  testEntityStats: TestEntityCount[]
): Record<TestEntityType, TestEntityCount[]> => {
  const filteredStats: Record<TestEntityType, TestEntityCount[]> = {
    test: [],
    beforeTest: [],
    afterTest: [],
  };
  testEntityStats.forEach((stat) => {
    if (stat.entityType === "test") {
      filteredStats.test.push(stat);
    } else if (stat.entityType === "beforeTest") {
      filteredStats.beforeTest.push(stat);
    } else if (stat.entityType === "afterTest") {
      filteredStats.afterTest.push(stat);
    }
  });
  return filteredStats;
};

/**
 * Groups test entity statistics by status groups and calculates totals
 */
export const organizeByStatusGroups = (
  stats: TestEntityCount[],
  statuses: Status[],
  statusGroups: StatusGroup[]
): GroupedStatusData[] => {
  const groupedStats: Record<string, GroupedStatusData> = {};

  // Initialize groups
  statusGroups.forEach((group) => {
    groupedStats[group.id] = {
      group,
      statuses: [],
      totalCount: 0,
    };
  });

  // Add a "Not set" group for null status IDs
  const nullGroupId = "null-group";
  groupedStats[nullGroupId] = {
    group: {
      id: nullGroupId,
      title: "Not set",
      color: "#808080",
      createdTimestamp: new Date().toISOString(),
    },
    statuses: [],
    totalCount: 0,
  };

  // Populate groups with statuses
  stats.forEach((stat) => {
    if (stat.statusId === null) {
      // Handle null status
      groupedStats[nullGroupId].statuses.push({
        status: null,
        count: stat.count,
      });
      groupedStats[nullGroupId].totalCount += stat.count;
    } else {
      // Find status and its group
      const status = statuses.find((s) => s.id === stat.statusId);
      if (status) {
        const groupId = status.groupId;
        if (groupedStats[groupId]) {
          groupedStats[groupId].statuses.push({
            status,
            count: stat.count,
          });
          groupedStats[groupId].totalCount += stat.count;
        }
      }
    }
  });

  // Filter out empty groups
  return Object.values(groupedStats).filter((group) => group.totalCount > 0);
};

/**
 * Organizes stats by entity type and status group
 */
export const organizeStatsByEntityType = (
  statusesCountsByEntityTypes: Record<TestEntityType, TestEntityCount[]>,
  statuses: Status[],
  statusGroups: StatusGroup[]
): Record<TestEntityType, GroupedStatusData[]> => {
  return {
    test: organizeByStatusGroups(statusesCountsByEntityTypes.test, statuses, statusGroups),
    beforeTest: organizeByStatusGroups(
      statusesCountsByEntityTypes.beforeTest,
      statuses,
      statusGroups
    ),
    afterTest: organizeByStatusGroups(
      statusesCountsByEntityTypes.afterTest,
      statuses,
      statusGroups
    ),
  };
};
