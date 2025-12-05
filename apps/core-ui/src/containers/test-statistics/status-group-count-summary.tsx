import { useFindStatusGroup } from "@/hooks/api/status-groups/use-find-status-group.jsx";
import { StatusDot } from "./status-dot.jsx";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import ErrorRetry from "@/components/ui/error-retry.js";

export type StatusGroupSummaryProps = {
  groupId: string | null;
  count: number;
};

export const StatusGroupCountSummary = ({
  groupId,
  count,
}: StatusGroupSummaryProps) => {
  const statusGroupQuery = useFindStatusGroup({
    enabled: groupId != undefined,
    filters: {
      id: groupId == undefined ? "" : groupId,
    },
  });

  const hasUndefinedColor = groupId == null;

  return (
    <div className="flex items-center">
      {statusGroupQuery.isError ? (
        <ErrorRetry onRetry={() => statusGroupQuery.refetch()} label={"Err."} className="mr-1" />
      ) : groupId != null && statusGroupQuery.isPending ? (
        <Skeleton className="h-3 w-3 rounded-full mr-1" />
      ) : (
        <StatusDot
          color={hasUndefinedColor ? null : statusGroupQuery.data?.body?.color}
          title={statusGroupQuery.data?.body?.title}
        />
      )}
      <span className="text-sm font-medium">{count}</span>
    </div>
  );
};
