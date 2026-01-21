import { ScrollArea } from "@/components/ui/scroll-area.js";
import { LaunchEntity, useFindLaunches } from "@/hooks/api/launches/use-find-launches.js";
import { PaginationBlock } from "@/components/ui/pagination-block.jsx";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import ErrorRetry from "@/components/ui/error-retry.js";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils.js";
import { LaunchesUrlFilters } from "@/types/launches-url-params.js";

interface LaunchesListContainerProps {
  pagination: {
    page: number;
    pageSize: number;
    setPage: (p: number) => void;
    setPageSize: (s: number) => void;
  };
  selection: {
    selectedId?: number;
    onSelect: (launchId: number) => void;
  };
  filters: LaunchesUrlFilters;
}

export default function LaunchesListContainer({
  pagination: { page, pageSize, setPage, setPageSize },
  selection: { selectedId, onSelect },
  filters: { reportId, "title~cnt": titleContains },
}: LaunchesListContainerProps) {
  const launchesQuery = useFindLaunches({
    pagination: {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    },
    filters: {
      reportId: reportId,
      titleContains: titleContains,
    },
    enabled: true,
  });

  const launchesData = launchesQuery.data;
  const launchesLoading = launchesQuery.isPending;
  const launchesError = launchesQuery.isError;

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 overflow-hidden">
        {launchesLoading && (
          <div className="flex flex-col gap-2 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-32" />
                  <div className="ml-auto">
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-40" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}
        {!launchesLoading && launchesError && (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <ErrorRetry onRetry={() => launchesQuery.refetch()} />
            </div>
          </div>
        )}

        {!launchesLoading &&
          !launchesError &&
          launchesData?.body.items?.length === 0 && (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <p className="text-lg font-bold text-secondary-foreground">
                  No launches found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting filters
                </p>
              </div>
            </div>
          )}

        {!launchesLoading &&
          !launchesError &&
          launchesData?.body.items != undefined &&
          launchesData?.body.items?.length > 0 && (
            <div className="flex flex-col gap-2 p-2">
              {launchesData.body.items.map((launch) => (
                <LaunchesListItem
                  key={launch.id}
                  launch={launch}
                  selected={launch.id === selectedId}
                  onClick={() => onSelect(launch.id)}
                />
              ))}
            </div>
          )}
      </ScrollArea>

      {launchesData && (
        <div className="border-t">
          <PaginationBlock
            page={page}
            pageSize={pageSize}
            totalItems={launchesData.body.pagination.total}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        </div>
      )}
    </div>
  );
}

interface LaunchItemProps {
  launch: LaunchEntity;
  selected: boolean;
  onClick: () => void;
}

function LaunchesListItem({ launch, selected, onClick }: LaunchItemProps) {
  return (
    <button
      key={launch.id}
      className={cn(
        "flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
        selected && "bg-muted"
      )}
      onClick={onClick}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold">Launch #{launch.id}</div>
          </div>
          <div
            className={cn(
              "ml-auto text-xs",
              selected ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {launch.startedTimestamp ? 
              formatDistanceToNow(new Date(launch.startedTimestamp), { addSuffix: true }) : 
              formatDistanceToNow(new Date(launch.createdTimestamp), { addSuffix: true })}
          </div>
        </div>
        <div className="text-xs font-medium">{launch.title}</div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        Report ID: {launch.reportId}
      </div>
    </button>
  );
}
