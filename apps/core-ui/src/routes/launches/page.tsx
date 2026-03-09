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
import { useNavigate } from '@modern-js/runtime/router';

export const title = "Launches - Total Report";

function LaunchesPageContent() {
  const navigate = useNavigate();
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
                  navigate(`/launches/${launchId}`),
              }}
            />
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
