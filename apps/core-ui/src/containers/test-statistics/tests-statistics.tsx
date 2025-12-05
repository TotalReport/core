import { useFindTestEntitiesStatusesCounts } from "@/hooks/api/test-entities/use-find-test-entities-statuses-counts.js";
import { ENTITY_TYPES } from "@/lib/test-statistics-utils.js";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import { EntityTypeSection } from "./entity-type-section.jsx";
import ErrorRetry from "@/components/ui/error-retry.js";

export type TestsStatisticsContainerProps = {
  reportId?: number;
  launchId?: number;
};

export const TestsStatistics = ({
  reportId,
  launchId,
}: TestsStatisticsContainerProps) => {
  const testEntitiesStatusesCountsResponse = useFindTestEntitiesStatusesCounts({
    filters: {
      reportId,
      launchId,
      distinct: true,
    },
  });

  const isError =
    testEntitiesStatusesCountsResponse.isError;

  const isPending =
    testEntitiesStatusesCountsResponse.isPending;

  if (isError) {
    const handleRetry = () => {
      testEntitiesStatusesCountsResponse.refetch();
    };

    return (
      <div className="mt-2 p-4 flex items-center justify-center min-h-[6rem]">
        <ErrorRetry onRetry={handleRetry} />
      </div>
    );
  }

  if (isPending) {
    // Render a skeleton-based loading UI inspired by StatusPill / TestDetailsStatus
    return (
      <div className="border rounded-md">
        <ul className="divide-y">
          {ENTITY_TYPES.map((entityType) => (
            <li key={entityType} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-28" />
                </div>
                <div>
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>

              <div className="mt-3 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-3 w-8 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-3 w-8" />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const data =
    isPending || isError ? [] : testEntitiesStatusesCountsResponse.data.body;
  const structuredData = data.reduce((acc, curr) => {
    const groupMap =
      acc.get(curr.entityType) || new Map<string, Map<null | string, number>>();
    const statusMap =
      groupMap.get(curr.statusGroupId) || new Map<null | string, number>();
    statusMap.set(curr.statusId, curr.count);
    groupMap.set(curr.statusGroupId, statusMap);
    acc.set(curr.entityType, groupMap);
    return acc;
  }, new Map<string, Map<string | null, Map<string | null, number>>>());

  return (
    <div className="border rounded-md">
      <ul className="divide-y">
        {ENTITY_TYPES.map((entityType) => {
          const data = structuredData.get(entityType);
          if (!data) {
            return <></>;
          }
          return (
            <EntityTypeSection
              key={entityType}
              entityType={entityType}
              counts={data}
            />
          );
        })}
      </ul>
    </div>
  );
};
