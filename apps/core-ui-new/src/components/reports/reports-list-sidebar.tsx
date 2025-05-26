'use client';

import { PaginationBlock } from "@/components/pagination-block";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useFindReports } from "@/hooks/reports/use-find-reports";
import { ReportFilters } from "@/types/report-filters";
import { ReportEntity } from "@/types/reports";
import { ReportFilter } from "./report-filter";
import { ReportListItem } from "./report-list-item";

interface ReportsListSidebarProps {
  page: number;
  pageSize: number;
  titleFilter: string;
  reportsQuery: ReturnType<typeof useFindReports>;
  selectedReportId: number | null;
  onReportClick: (report: ReportEntity) => void;
  onFilterChange: (filters: ReportFilters) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export const ReportsListSidebar = ({
  page,
  pageSize,
  titleFilter,
  reportsQuery,
  selectedReportId,
  onReportClick,
  onFilterChange,
  setPage,
  setPageSize,
}: ReportsListSidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2">
        <h1 className="text-xl font-bold">Reports</h1>
      </div>
      <div className="px-4 pb-2">
        <ReportFilter 
          initialTitle={titleFilter}
          onFilterChange={onFilterChange}
        />
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
                <ReportListItem
                  key={report.id}
                  report={report}
                  selected={report.id === selectedReportId}
                  onClick={() => onReportClick(report)}
                />
              ))}
            </div>
          )}
      </ScrollArea>
      
      {reportsQuery.data?.body && (
        <PaginationBlock
          page={page}
          pageSize={pageSize}
          totalItems={reportsQuery.data.body.pagination.total}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      )}
    </div>
  );
};
