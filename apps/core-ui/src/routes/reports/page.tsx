import { RestAPIProvider } from "@/components/providers/rest-api-provider.jsx";
import { ReportsListSidebar } from "@/components/reports/reports-list-sidebar.jsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.js";
import { useUrlParams } from "@/hooks/url/use-url-params.jsx";
import { useCallback } from "react";
import { ReportDetails } from "@/containers/report-details/report-details.jsx";

export const ReportsPageContent = () => {
  const { useParams } = useUrlParams();

  const { urlParams, setUrlParams } = useParams<{
    page: number;
    pageSize: number;
    "title~cnt": string | undefined;
    selectedReportId: number | undefined;
  }>({
    page: {
      defaultValue: 1,
      constraintFn: (value) => Math.max(1, value),
    },
    pageSize: {
      defaultValue: 10,
      constraintFn: (value) => Math.max(1, value),
    },
    "title~cnt": { defaultValue: undefined },
    selectedReportId: { defaultValue: undefined },
  });

  const handleFilterChange = useCallback(
    (filterValue: string | null) => {
      setUrlParams({ "title~cnt": filterValue ?? undefined, page: 1 });
    },
    [urlParams]
  );

  return (
    <div className="flex h-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full border items-stretch"
      >
        <ResizablePanel defaultSize={20} collapsible={false} minSize={25}>
          <ReportsListSidebar
            page={urlParams.page}
            pageSize={urlParams.pageSize}
            titleFilter={urlParams["title~cnt"] ?? undefined}
            selectedReportId={urlParams.selectedReportId ?? null}
            onReportClick={(reportId) =>
              setUrlParams({ selectedReportId: reportId })
            }
            onFilterChange={handleFilterChange}
            setPage={(page) => setUrlParams({ page })}
            setPageSize={(pageSize) => setUrlParams({ pageSize })}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          {urlParams.selectedReportId == null && (
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
          {urlParams.selectedReportId != null && (
            <ReportDetails reportId={urlParams.selectedReportId} />
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
