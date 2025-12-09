import { RestAPIProvider } from "@/components/providers/rest-api-provider.jsx";
import { ReportsListSidebar } from "@/components/reports/reports-list-sidebar.jsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.js";
import { useReportsList } from "@/hooks/use-reports-list.hook.js";
import { ReportDetails } from "../../containers/reports/report-details.jsx";

export const ReportsPageContent = () => {
  const {
    page,
    pageSize,
    titleFilter,
    selectedReportId,
    handleReportClick,
    handleFilterChange,
    setPage,
    setPageSize,
  } = useReportsList();

  return (
    <div className="flex h-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full border items-stretch"
      >
        <ResizablePanel defaultSize={20} collapsible={false} minSize={25}>
          <ReportsListSidebar
            page={page}
            pageSize={pageSize}
            titleFilter={titleFilter}
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
    </div>
  );
};

const ReportsPage = () => {
  return (
    <div>
      <RestAPIProvider>
        <ReportsPageContent />
      </RestAPIProvider>
    </div>
  );
};

export default ReportsPage;
