import { totalPagesCount } from "@/lib/pagination-utils";
import { tsr } from "@/lib/react-query";
import { getUrlParamNumber } from "@/lib/url-utils";
import { useEffect, useState } from "react";
import { RestAPIProvider } from "./RestAPIProvider";
import { StandaloneReportDetails } from "./StandaloneReportDetails";
import { PaginationBlock } from "./pagination-block";
import { type ReportEntity } from "./reports-list-item";
import { ReportsListItemFetcher } from "./reports-list-item-fetcher";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { ReportsParam } from "./reports-page-params";

const Internal = () => {
  const [page, setPage] = useState(() => Math.max(1, getUrlParamNumber("page", 1)));
  const [pageSize, setPageSize] = useState(() => Math.max(1, getUrlParamNumber("pageSize", 10)));
  
  // Track selected report ID
  const [selectedReportId, setSelectedReportId] = useState<number | null>(() => {
    const reportId = getUrlParamNumber(ReportsParam.SELECTED_REPORT_ID, -1);
    return reportId > 0 ? reportId : null;
  });

  const reportsQuery = tsr.findReports.useQuery({
    queryKey: [`reports?page=${page}&pageSize=${pageSize}`],
    queryData: {
      query: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      },
    },
  });

  useEffect(() => {
    if (page < 1) setPage(1);
    
    if (pageSize < 1) setPageSize(10);
    
    if (!reportsQuery.isPending) {
      const totalPages = totalPagesCount(
        reportsQuery.data?.body.pagination.total || 0,
        pageSize
      );

      if (page > totalPages && totalPages > 0) {
        setPage(totalPages);
      }
    }
    
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("pageSize", pageSize.toString());
      
      // Update reportId parameter
      if (selectedReportId) {
        url.searchParams.set(ReportsParam.SELECTED_REPORT_ID, selectedReportId.toString());
      } else {
        url.searchParams.delete(ReportsParam.SELECTED_REPORT_ID);
      }
      
      window.history.replaceState({}, "", url.toString());
    }
  }, [page, pageSize, selectedReportId, reportsQuery]);

  // Handler for when a report item is clicked
  const handleReportClick = (report: ReportEntity) => {
    setSelectedReportId(report.id);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full border items-stretch"
    >
      <ResizablePanel
        autoSave="true"
        defaultValue={20}
        collapsible={false}
        minSize={25}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Reports</h1>
          </div>
          <Separator />
          <ScrollArea className="flex-1 overflow-hidden">
            {reportsQuery.isPending && <p className="p-4">Loading...</p>}
            {!reportsQuery.isPending &&
              reportsQuery.data?.body?.items.length === 0 && (
                <div className="flex items-center justify-center flex-grow">
                  <div className="text-center">
                    <p className="text-lg font-bold text-secondary-foreground">
                      No reports found
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting filters
                    </p>
                  </div>
                </div>
              )}
            {!reportsQuery.isPending &&
              reportsQuery.data?.body?.items != undefined &&
              reportsQuery.data?.body?.items.length > 0 && (
                <div className="flex flex-col gap-2 p-2">
                  {reportsQuery.data.body.items.map((report) => (
                    <ReportsListItemFetcher
                      key={report.id}
                      report={report}
                      selected={report.id === selectedReportId}
                      onClick={() => handleReportClick(report)}
                    />
                  ))}
                </div>
              )}
          </ScrollArea>
          <PaginationBlock
            page={page}
            pageSize={pageSize}
            totalItems={reportsQuery.data?.body.pagination.total!}
            setPage={setPage}
            setPageSize={setPageSize}
          ></PaginationBlock>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <StandaloneReportDetails />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export const ReportsList = () => {
  return (
    <RestAPIProvider>
      <Internal />
    </RestAPIProvider>
  );
};