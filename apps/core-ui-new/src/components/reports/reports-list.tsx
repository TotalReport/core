'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useReportsList } from "@/hooks/reports/use-reports-list";
import { ReportsListSidebar } from "./reports-list-sidebar";
import { ReportDetails } from "./report-details";

export const ReportsList = () => {
  const {
    page,
    pageSize,
    titleFilter,
    selectedReportId,
    reportsQuery,
    handleReportClick,
    handleFilterChange,
    setPage,
    setPageSize,
  } = useReportsList();

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
        <ReportsListSidebar
          page={page}
          pageSize={pageSize}
          titleFilter={titleFilter}
          reportsQuery={reportsQuery}
          selectedReportId={selectedReportId}
          onReportClick={handleReportClick}
          onFilterChange={handleFilterChange}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <ReportDetails reportId={selectedReportId} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
