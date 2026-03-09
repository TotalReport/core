import ErrorRetry from "@/components/ui/error-retry.js";
import { PaginationBlock } from "@/components/ui/pagination-block.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.js";
import StatusSummary from "@/containers/launches-list/status-summary.jsx";
import {
  LaunchEntity,
  useFindLaunches,
} from "@/hooks/api/launches/use-find-launches.js";
import { useFindTestEntitiesStatusesCounts } from "@/hooks/api/test-entities/use-find-test-entities-statuses-counts.js";
import { cn } from "@/lib/utils.js";
import { LaunchesUrlFilters } from "@/types/launches-url-params.js";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "../../components/ui/skeleton.jsx";

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
  filters: { "title~cnt": titleContains },
}: LaunchesListContainerProps) {
  const launchesQuery = useFindLaunches({
    pagination: {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    },
    filters: {
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
              <div
                key={i}
                className="flex flex-col gap-1 rounded-lg border p-3"
              >
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
        selected && "bg-muted",
      )}
      onClick={onClick}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="font-semibold">{launch.title}</div>
          </div>
        </div>

        {/* Statuses summary row (delegated to internal component) */}
        <LaunchStatusesSummary launchId={launch.id} />

        <div className="flex items-center">
          <div
            className={cn(
              "ml-auto text-xs text-right",
              selected ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {formatDistanceToNow(new Date(launch.startedTimestamp), {
              addSuffix: true,
            })}
          </div>
        </div>
      </div>
    </button>
  );
}

function LaunchStatusesSummary({ launchId }: { launchId: number }) {
  const countsQuery = useFindTestEntitiesStatusesCounts({
    filters: { launchId, distinct: true },
  });

  const countsLoading = countsQuery.isPending;
  const countsError = countsQuery.isError;
  const countsData = countsQuery.data?.body ?? [];

  const aggregated = countsData.reduce((acc: Map<string | null, number>, curr) => {
    const id = curr.statusId ?? null;
    acc.set(id, (acc.get(id) || 0) + curr.count);
    return acc;
  }, new Map<string | null, number>());

  const statusesToShow = Array.from(aggregated.entries())
    .map(([statusId, count]) => ({ statusId, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="mt-1 flex items-center gap-3 flex-wrap w-full">
      {countsLoading ? (
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-12" />
        </div>
      ) : countsError ? (
        <ErrorRetry onRetry={() => countsQuery.refetch()} />
      ) : (
        statusesToShow.map((s) => (
          <div key={String(s.statusId)} className="flex items-center gap-2 text-xs text-muted-foreground mr-2">
            <StatusSummary statusId={s.statusId} size="w-3 h-3" />
            <span className="ml-1 font-medium">{s.count}</span>
          </div>
        ))
      )}
    </div>
  );
}
