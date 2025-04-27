import { tsr } from "@/lib/react-query";
import { useEffect, useState } from "react";
import { ReportListItem, type ReportEntity } from "./reports-list-item";

type ReportsListItemFetcherProps = {
  report: ReportEntity;
  selected: boolean;
  onClick: () => void;
};

export const ReportsListItemFetcher = ({
  report,
  selected,
  onClick,
}: ReportsListItemFetcherProps) => {
  // Create a local copy of the report to ensure React re-renders when updated
  const [reportData, setReportData] = useState<ReportEntity>({...report});
  
  const launchesCount = tsr.findLaunchesCount.useQuery({
    queryKey: [`/launches/count/${report.id}`],
    queryData: {
      query: { reportId: report.id },
    },
  });

  useEffect(() => {
    // Update the local state when the base report changes
    setReportData({...report});
  }, [report]);

  useEffect(() => {
    if (!launchesCount.isPending && launchesCount.data) {
      // Create a new object to ensure React detects the change
      setReportData(prev => ({
        ...prev,
        launchesCount: launchesCount.data.body.count
      }));
    }
  }, [launchesCount.isPending, launchesCount.data]);

  return (
    <ReportListItem
      report={reportData}
      selected={selected}
      onClick={onClick}
    ></ReportListItem>
  );
};
