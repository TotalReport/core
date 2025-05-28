"use client";

import { tsr } from "@/lib/react-query";
import { useFindTestEntitiesStatusesCounts } from "../test-statistics/use-find-test-entities-statuses-counts";
import { LaunchStatistics } from "@/types/launch";

/**
 * Hook for fetching test statistics for a launch
 */
export const useLaunchStatistics = ({
  filter,
  enabled = true,
}: UseLaunchStatisticsParams): UseLaunchStatisticsResponse => {
  // Fetch both test entity stats and status information
  const testEntitiesStatsQuery = useFindTestEntitiesStatusesCounts({
    filters: {
      launchId: filter.id !== null ? filter.id : undefined,
      distinct: false, // We don't need distinct for a single launch
    },
    enabled: enabled !== false && filter.id !== null && filter.id > 0,
  });
  
  // Fetch status groups and statuses to map status IDs to status groups
  const statusesQuery = tsr.findTestStatuses.useQuery({
    queryKey: ["testStatuses"],
    enabled: enabled !== false && filter.id !== null && filter.id > 0,
  });

  // Extract the data
  const testEntityStats = testEntitiesStatsQuery.data;
  const statuses = statusesQuery.data?.body?.items || [];
  
  // Map the data to the expected format for launch statistics
  let statistics: LaunchStatistics | null = null;
  
  if (testEntityStats) {
    statistics = {
      beforeTests: testEntityStats
        .filter(stat => stat.entityType === "beforeTest")
        .map(stat => {
          // Find the status group ID from the status ID
          const statusGroupId = stat.statusId ? 
            statuses.find(s => s.id === stat.statusId)?.groupId || null : 
            null;
          
          return {
            statusGroupId,
            count: stat.count
          };
        }),
      tests: testEntityStats
        .filter(stat => stat.entityType === "test")
        .map(stat => {
          // Find the status group ID from the status ID
          const statusGroupId = stat.statusId ? 
            statuses.find(s => s.id === stat.statusId)?.groupId || null : 
            null;
          
          return {
            statusGroupId,
            count: stat.count
          };
        }),
      afterTests: testEntityStats
        .filter(stat => stat.entityType === "afterTest")
        .map(stat => {
          // Find the status group ID from the status ID
          const statusGroupId = stat.statusId ? 
            statuses.find(s => s.id === stat.statusId)?.groupId || null : 
            null;
          
          return {
            statusGroupId,
            count: stat.count
          };
        })
    };
  }

  return {
    isLoading: testEntitiesStatsQuery.isPending || statusesQuery.isPending,
    isError: testEntitiesStatsQuery.isError || statusesQuery.isError,
    data: statistics ? { body: statistics } : null,
  };
};

export type UseLaunchStatisticsParams = {
  filter: {
    id: number | null;
  };
  enabled?: boolean;
};

export type UseLaunchStatisticsResponse = {
  isLoading: boolean;
  isError: boolean;
  data: { body: LaunchStatistics } | null;
};
