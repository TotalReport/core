import { useFindStatusGroup } from "@/hooks/api/status-groups/use-find-status-group.jsx";
import { StatusDot } from "./status-dot.jsx";
import { Skeleton } from "../../components/ui/skeleton.jsx";

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
        <button
          onClick={() => statusGroupQuery.refetch()}
          title="Error loading status group. Click to retry."
          aria-label="Retry loading status group"
          className="flex items-center gap-1 text-error-foreground hover:brightness-200 focus:outline-none focus:ring-2 focus:ring-error-foreground focus:ring-offset-1 rounded transition-colors mr-1"
        >
          Err.
          <span className="inline-block">↻</span>
        </button>
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
