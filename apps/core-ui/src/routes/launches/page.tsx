import { RestAPIProvider } from "@/components/providers/rest-api-provider.jsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.jsx";
import LaunchDetails from "@/containers/launch-details/launch-details.jsx";
import { LaunchesListBlock } from "@/containers/launches-list/launches-list-block.jsx";
import { useUrlParams } from "@/hooks/url/use-url-params.jsx";
import LaunchesUrlParams from "@/types/launches-url-params.js";

export const title = "Launches - Total Report";

function LaunchesPageContent() {
  const { useParams } = useUrlParams();

  const { urlParams, setUrlParams } = useParams<LaunchesUrlParams>({
    page: {
      defaultValue: 1,
      constraintFn: (value) => Math.max(1, value),
    },
    pageSize: {
      defaultValue: 10,
      constraintFn: (value) => Math.max(1, value),
    },
    "title~cnt": { defaultValue: undefined },
    selectedLaunchId: { defaultValue: undefined },
  });

  const { page, pageSize, ...filters } = urlParams;

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full border rounded-md"
        >
          <ResizablePanel
            defaultSize={30}
            minSize={20}
            maxSize={50}
            collapsible={false}
          >
            <LaunchesListBlock
              pagination={{
                page,
                pageSize,
                setPage: (page) => setUrlParams({ page }),
                setPageSize: (pageSize) => setUrlParams({ pageSize }),
              }}
              filters={filters}
              onFiltersChange={(v) => setUrlParams(v)}
              selection={{
                selectedId: filters.selectedLaunchId ?? null,
                onSelect: (launchId) =>
                  setUrlParams({ selectedLaunchId: launchId }),
              }}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={70}>
            {filters.selectedLaunchId === undefined && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-lg font-bold text-secondary-foreground">
                    No launch selected
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select a launch from the list to view details
                  </p>
                </div>
              </div>
            )}
            {filters.selectedLaunchId !== undefined && (
              <LaunchDetails launchId={filters.selectedLaunchId} />
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default function LaunchesPage() {
  return (
    <RestAPIProvider>
      <LaunchesPageContent />
    </RestAPIProvider>
  );
}
