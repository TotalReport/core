'use client';

import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useReportDetails } from "@/hooks/reports/use-report-details";
import Link from "next/link";
import { TestStatisticsList } from "@/components/test-statistics/test-statistics-list";

interface ReportDetailsProps {
  reportId?: number;
}

export const ReportDetails = ({ reportId }: ReportDetailsProps) => {
  const {
    reportQuery,
    launchesCountQuery,
    testEntityStatsQuery,
    statusesQuery,
    statusGroupsQuery,
  } = useReportDetails(reportId);

  // Show placeholder when no report is selected
  if (!reportId) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-secondary-foreground">
            No report selected
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Select a report from the list to view details
          </p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (reportQuery.isPending || testEntityStatsQuery.isPending || statusesQuery.isPending || statusGroupsQuery.isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-secondary-foreground">
            Loading report details...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (reportQuery.error || !reportQuery.data?.body) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-secondary-foreground">
            Error loading report details
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {reportQuery.error instanceof Error 
              ? reportQuery.error.message 
              : "Unable to fetch report data"}
          </p>
        </div>
      </div>
    );
  }

  const report = reportQuery.data.body;
  const launchesCount = launchesCountQuery.data?.body.count || 0;
  const testEntityStats = testEntityStatsQuery.data || [];
  const statuses = statusesQuery.data?.body?.items || [];
  const statusGroups = statusGroupsQuery.data?.body?.items || [];

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{report.title}</h2>
        <div className="text-sm text-muted-foreground">Report #{report.id}</div>
      </div>

      <Separator className="my-4" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
          <p>{format(new Date(report.createdTimestamp), "PPpp")}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Launches</h3>
          <p>{launchesCount}</p>
        </div>
      </div>

      {/* Test statistics section */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Test Statistics</h3>
        {testEntityStats.length > 0 ? (
          <TestStatisticsList 
            testEntityStats={testEntityStats}
            statuses={statuses}
            statusGroups={statusGroups}
          />
        ) : (
          <p className="text-muted-foreground">No test data available</p>
        )}
      </div>
      
      <div className="mt-6">
        <Button asChild variant="outline">
          <Link href={`/launches?reportId=${report.id}&page=1&pageSize=10`}>
            View Launches
          </Link>
        </Button>
      </div>
    </div>
  );
};
