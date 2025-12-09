import { useFindReport } from "@/hooks/api/reports/use-find-report.js";
import { useFindLaunchesCount } from "@/hooks/api/launches/use-launches-counts.jsx";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { TestsStatistics } from "../test-statistics/tests-statistics.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import ErrorRetry from "@/components/ui/error-retry.js";

interface ReportDetailsProps {
  reportId: number;
}

export const ReportDetails: React.FC<ReportDetailsProps> = ({ reportId }) => {
  const reportQuery = useFindReport({
    filters: { id: reportId },
  });

  const launchesCountQuery = useFindLaunchesCount({
    filters: { reportId },
  });

  if (reportQuery.isPending) {
    return (
      <div className="p-6 h-full overflow-auto">
        <div className="flex flex-col gap-6">
          <div>
            <Skeleton className="h-8 w-48" />
            <div className="mt-2">
              <Skeleton className="h-3 w-36" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">ID</h3>
              <Skeleton className="h-4 w-20 mt-1" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Created
              </h3>
              <Skeleton className="h-4 w-40 mt-1" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Launches
              </h3>
              <Skeleton className="h-4 w-20 mt-1" />
            </div>
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground pb-2">
                Statistics
              </h3>
              <Skeleton className="h-6 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (reportQuery.isError || !reportQuery.data || reportQuery.data.status !== 200) {
    const handleRetry = () => {
      reportQuery.refetch();
    };

    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mt-3">
            <ErrorRetry onRetry={handleRetry} />
          </div>
        </div>
      </div>
    );
  }

  const report = reportQuery.data.body;
  const launchesCount = launchesCountQuery.data?.count || 0;

  return (
    <div>
      <div className="flex items-center justify-between p-2 border-b">
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
