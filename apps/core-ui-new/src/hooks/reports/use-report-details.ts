"use client";

import { tsr } from "@/lib/react-query";
import { useFindReport } from "./use-find-report";
import { useFindTestEntitiesStatusesCounts } from "../test-statistics/use-find-test-entities-statuses-counts";

export const useReportDetails = (reportId: number | undefined) => {
  // Fetch report details
  const reportQuery = useFindReport({
    filter: { id: reportId || 0 },
    enabled: reportId !== undefined && reportId > 0,
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
    enabled: reportId !== undefined && reportId > 0,  });
    // Fetch test status statistics for this report
  const testEntityStatsQuery = useFindTestEntitiesStatusesCounts({
    filters: {
      reportId,
      distinct: true,
    },
    enabled: reportId !== undefined && reportId > 0,
  });

  //TODO move to separate hook
  // Fetch status groups and statuses for formatting
  const statusesQuery = tsr.findTestStatuses.useQuery({
    queryKey: ["testStatuses"],
    enabled: reportId !== undefined && reportId > 0,
  });

  //TODO move to separate hook
  const statusGroupsQuery = tsr.findTestStatusGroups.useQuery({
    queryKey: ["testStatusGroups"],
    enabled: reportId !== undefined && reportId > 0,
  });

  return {
    reportQuery,
    launchesCountQuery,
    testEntityStatsQuery,
    statusesQuery,
    statusGroupsQuery,
  };
};
