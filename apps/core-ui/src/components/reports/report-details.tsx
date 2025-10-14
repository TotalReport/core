/**
 * Component that displays the details of a selected report
 */

import { format } from "date-fns";
import { Button } from "@/components/ui/button.js";
import { Link } from "@modern-js/runtime/router";
import { TestsStatistics } from "@/containers/test-statistics/tests-statistics.jsx";
import { Trash2, Pencil } from "lucide-react";
import { useFindReport } from "@/hooks/api/reports/use-find-report.js";
import { useFindLaunchesCount } from "@/hooks/api/launches/use-launches-counts.jsx";

interface ReportDetailsProps {
  reportId: number;
}

export const ReportDetails: React.FC<ReportDetailsProps> = ({ reportId }) => {
  const reportQuery = useFindReport({
    filters: { id: reportId }
  });

  const launchesCountQuery = useFindLaunchesCount({
    filters: { reportId }
  });

  // Show loading state
  if (reportQuery.isPending) {
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
  if (reportQuery.isError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-red-600">Error loading report</p>
          <p className="text-sm text-muted-foreground mt-1">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  const report = reportQuery.data;
  const launchesCount = launchesCountQuery.data?.count || 0;

  return (
    <div>      <div className="flex items-center justify-between p-2 border-b">
        <h2 className="text-xl font-bold">Report details</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" aria-label="Edit report">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Delete report">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col h-full overflow-auto p-4">
        <h1 className="text-xl font-bold pb-2">{report.title}</h1>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">ID</h3>
            <p>{report.id}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Created
            </h3>
            <p>{format(new Date(report.createdTimestamp), "PPpp")}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Launches
            </h3>
            <p>{launchesCount}</p>
          </div>
          <div className="col-span-2">
            <h3 className="text-sm font-medium text-muted-foreground pb-2">
              Statistics
            </h3>
            <TestsStatistics reportId={reportId} />
          </div>
        </div>
      </div>
    </div>
  );
};
