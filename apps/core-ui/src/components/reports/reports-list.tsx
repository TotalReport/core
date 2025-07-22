/**
 * Component that displays the list of reports with a sidebar and details panel
 */

import { useReportsList } from "@/hooks/use-reports-list.hook.js";
import { ReportsListSidebar } from "./reports-list-sidebar.jsx";
import { ReportDetails } from "./report-details.jsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.js";

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
      <ResizablePanel defaultSize={20} collapsible={false} minSize={25}>
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
        {selectedReportId == null && (
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
        )}
        {selectedReportId != null && (
          <ReportDetails reportId={selectedReportId} />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
