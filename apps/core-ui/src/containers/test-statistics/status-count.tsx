import { useFindStatus } from "@/hooks/api/statuses/use-find-status.jsx";
import { StatusDot } from "./status-dot.jsx";
import { Skeleton } from "../../components/ui/skeleton.jsx";

export type StatusCountProps = {
  /**
   * The ID of the status to display details for. If null, it indicates a status that is not set yet (test entity in progress).
   */
  statusId: string | null;
  /**
   * The count of test entities associated with this status.
   */
  count: number;
};

export const StatusCount = ({ statusId, count }: StatusCountProps) => {
  const statusQuery = useFindStatus({
    enabled: statusId != null,
    filters: {
      id: statusId == undefined ? "" : statusId,
    },
  });

  const response = statusQuery.data?.body;

  if (statusQuery.isError) {
    const handleRetry = () => {
      statusQuery.refetch();
    };

    return (
      <div className="flex items-center justify-between w-full">
        <button
          onClick={handleRetry}
          className="text-sm flex items-center gap-1 text-error-foreground hover:brightness-200 focus:outline-none focus:ring-2 focus:ring-error-foreground focus:ring-offset-1 rounded transition-colors"
          title="Error loading status. Click to retry."
        >
          Error.
          <span className="inline-block">↻</span>
        </button>
        <span className="text-sm font-medium ml-4">{count}</span>
      </div>
    );
  }

  if (statusId != null && statusQuery.isPending) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2 min-w-0">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-8" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2 min-w-0">
        <StatusDot
          color={response?.color}
          size="w-2 h-2"
          title={response?.title}
        />
        <span className="text-sm truncate">{response?.title || "Not set"}</span>
      </div>
      <span className="text-sm font-medium ml-4">{count}</span>
    </div>
  );
};
