import { totalPagesCount } from "@/lib/pagination-utils";
import { tsr } from "@/lib/react-query";
import { getUrlParamNumber, getUrlParamValue, updateUrlParams } from "@/lib/url-utils";
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
import { ReportsFilter, type ReportFilters } from "./ReportsFilter";

const Internal = () => {
  const [page, setPage] = useState(() => Math.max(1, getUrlParamNumber("page", 1)));
  const [pageSize, setPageSize] = useState(() => Math.max(1, getUrlParamNumber("pageSize", 10)));
  const [titleFilter, setTitleFilter] = useState(() => getUrlParamValue("title~cnt", ""));
  
  // Track selected report ID
  const [selectedReportId, setSelectedReportId] = useState<number | null>(() => {
    const reportId = getUrlParamNumber(ReportsParam.SELECTED_REPORT_ID, -1);
    return reportId > 0 ? reportId : null;
  });

  const reportsQuery = tsr.findReports.useQuery({
    queryKey: [`reports?page=${page}&pageSize=${pageSize}&title~cnt=${titleFilter}`],
    queryData: {
      query: {
        "title~cnt": titleFilter || undefined,
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
      const params: Record<string, string | null> = {
        "page": page.toString(),
        "pageSize": pageSize.toString(),
        "title~cnt": titleFilter || null,
      };
      
      // Update reportId parameter
      if (selectedReportId) {
        params[ReportsParam.SELECTED_REPORT_ID] = selectedReportId.toString();
      } else {
        params[ReportsParam.SELECTED_REPORT_ID] = null;
      }
      
      updateUrlParams(params);
    }
  }, [page, pageSize, titleFilter, selectedReportId, reportsQuery]);

  // Handler for when a report item is clicked
  const handleReportClick = (report: ReportEntity) => {
    setSelectedReportId(report.id);
  };

  // Handler for filter changes
  const handleFilterChange = (filters: ReportFilters) => {
    setTitleFilter(filters.titleFilter);
    setPage(1); // Reset to first page when filters change
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
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-xl font-bold">Reports</h1>
          </div>
          <div className="px-4 pb-2">
            <ReportsFilter onFilterChange={handleFilterChange} />
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