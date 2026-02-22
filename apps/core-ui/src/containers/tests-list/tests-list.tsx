import ErrorRetry from "@/components/ui/error-retry.js";
import { PaginationBlock } from "@/components/ui/pagination-block.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.js";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import { StatusPill } from "@/containers/test-status/test-status-pill.jsx";
import { useFindTestEntities } from "@/hooks/api/test-entities/use-find-test-entities.js";
import {
  FormattedTestEntity,
  getTestTypeFromEntityType,
} from "@/lib/test-utils.js";
import { cn } from "@/lib/utils.js";
import { TestsUrlFilters } from "@/types/tests-url-params.js";
import { formatDistanceToNow } from "date-fns";
import { SelectedTest } from "./tests-list-block.jsx";

interface TestsListProps {
  pagination: {
    page: number;
    pageSize: number;
    setPage: (p: number) => void;
    setPageSize: (s: number) => void;
  };
  selection: {
    selectedId?: number;
    onSelect: (launchId: SelectedTest) => void;
  };
  filters: TestsUrlFilters;
}

export const TestsList = ({
  pagination: { page, pageSize, setPage, setPageSize },
  selection: { selectedId, onSelect },
  filters,
}: TestsListProps) => {
  const testEntitiesQuery = useFindTestEntities({
    pagination: {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    },
    filters: filters,
  });

  const isError = testEntitiesQuery.isError;
  const isPending = testEntitiesQuery.isPending;
  const testEntitiesData = testEntitiesQuery.data;

  return (
    <>
      <ScrollArea className="flex-1 overflow-hidden">
        {isPending && (
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

        {isError && (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <ErrorRetry onRetry={() => testEntitiesQuery.refetch()} />
            </div>
          </div>
        )}

        {!isPending &&
          !isError &&
          testEntitiesData?.body.items.length === 0 && (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <p className="text-lg font-bold text-secondary-foreground">
                  No tests found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting filters
                </p>
              </div>
            </div>
          )}

        {!isPending &&
          !isError &&
          testEntitiesData?.body?.items?.length !== undefined &&
          testEntitiesData?.body?.items?.length > 0 && (
            <div className="flex flex-col gap-2 p-2">
              {testEntitiesData.body.items.map((test) => (
                <TestsListItem
                  key={`${test.id}-${test.entityType}`}
                  test={test}
                  selected={test.id === selectedId}
                  onClick={() =>
                    onSelect({
                      id: test.id,
                      type: getTestTypeFromEntityType(test.entityType),
                    })
                  }
                />
              ))}
            </div>
          )}
      </ScrollArea>

      {testEntitiesQuery.data && testEntitiesData?.body?.pagination && (
        <div className="border-t">
          <PaginationBlock
            page={page}
            pageSize={pageSize}
            totalItems={testEntitiesData?.body?.pagination.total}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        </div>
      )}
    </>
  );
};

type TestListItemProps = {
  test: FormattedTestEntity;
  selected: boolean;
  onClick: () => void;
};

export const TestsListItem = ({
  test,
  selected,
  onClick,
}: TestListItemProps) => {
  return (
    <div>
      <button
        className={cn(
          "flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
          selected && "bg-muted",
        )}
        onClick={onClick}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              {test.status ? (
                <div className="relative flex items-center">
                  <StatusPill statusId={test.status.id} size="sm" />
                  <span className="ml-2 font-semibold">{test.status.name}</span>
                </div>
              ) : (
                <div className="font-semibold">No Status</div>
              )}
            </div>
            <div
              className={cn(
                "ml-auto text-xs",
                selected ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {formatDistanceToNow(new Date(test.startedTimestamp), {
                addSuffix: true,
              })}
            </div>
          </div>
          <div className="text-xs font-medium">{test.title}</div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="font-medium">Type:</span>
            <span>{test.entityType}</span>
          </span>
          {test.correlationId && (
            <>
              <span className="mx-2">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="font-medium">ID:</span>
                <span className="truncate">{test.correlationId}</span>
              </span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
