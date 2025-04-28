import { tsr } from "@/lib/react-query";
import { format } from "date-fns";
import { useNumericUrlParam } from "@/lib/hooks/useUrlParam";
import { Separator } from "./ui/separator";
import { buttonVariants } from "./ui/button";
import { ReportsParam } from "./reports-page-params";

export const StandaloneReportDetails = () => {
  // Use hook to manage the reportId URL parameter
  const [reportId, setReportId] = useNumericUrlParam(ReportsParam.SELECTED_REPORT_ID);

  // Fetch report details
  const reportQuery = tsr.readReport.useQuery({
    queryKey: [`/reports/${reportId}`],
    queryData: {
      params: { id: reportId || 0 },
    },
    enabled: reportId !== null && reportId > 0,
  });

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
  if (reportQuery.error || !reportQuery.data?.body) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-bold text-secondary-foreground">
            Error loading report details
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {JSON.stringify(reportQuery.error) || "Unable to fetch report data"}
          </p>
        </div>
      </div>
    );
  }

  const report = reportQuery.data.body;
  const launchesCount = launchesCountQuery.data?.body.count || 0;

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

      <div className="mt-6">
        <a 
          className={buttonVariants({ variant: "outline" })} 
          href={`/launches?reportId=${report.id}&page=1&pageSize=10`}
        >
          View Launches
        </a>
      </div>
    </div>
  );
};