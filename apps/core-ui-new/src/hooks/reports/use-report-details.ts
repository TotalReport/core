"use client";

import { tsr } from "@/lib/react-query";
import { useFindReport } from "./use-find-report";

export const useReportDetails = (reportId: number | null) => {
  // Fetch report details
  const reportQuery = useFindReport({
    filter: { id: reportId || 0 },
    enabled: reportId !== null && reportId > 0,
  });

  //TODO move to separate hook
  // Fetch launch count for this report
  const launchesCountQuery = tsr.findLaunchesCount.useQuery({
    queryKey: [`launchesCount?reportId=${reportId}`],
    queryData: {
      query: {
        reportId: reportId || 0,
      },
    },
    enabled: reportId !== null && reportId > 0,
  });

  //TODO move to separate hook
  // Fetch test status statistics for this report
  const testEntityStatsQuery = tsr.findTestEntitiesCountsByStatuses.useQuery({
    queryKey: [`testEntitiesCounts?reportId=${reportId}`],
    queryData: {
      query: {
        reportId: reportId || 0,
        distinct: true,
      },
    },
    enabled: reportId !== null && reportId > 0,
  });

  //TODO move to separate hook
  // Fetch status groups and statuses for formatting
  const statusesQuery = tsr.findTestStatuses.useQuery({
    queryKey: ["testStatuses"],
    enabled: reportId !== null && reportId > 0,
  });

  //TODO move to separate hook
  const statusGroupsQuery = tsr.findTestStatusGroups.useQuery({
    queryKey: ["testStatusGroups"],
    enabled: reportId !== null && reportId > 0,
  });

  return {
    reportQuery,
    launchesCountQuery,
    testEntityStatsQuery,
    statusesQuery,
    statusGroupsQuery,
  };
};
