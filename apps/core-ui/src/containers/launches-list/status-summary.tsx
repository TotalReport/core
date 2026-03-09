import { useFindStatus } from "@/hooks/api/statuses/use-find-status.js";
import { StatusDot } from "@/containers/test-statistics/status-dot.jsx";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import ErrorRetry from "@/components/ui/error-retry.js";
import { cn } from "@/lib/utils.js";

export type StatusSummaryProps = {
  statusId: string | null;
  size?: string;
  className?: string;
};

export const StatusSummary = ({
  statusId,
  size = "w-3 h-3",
  className,
}: StatusSummaryProps) => {
  const statusQuery = useFindStatus({
    enabled: statusId != null,
    filters: {
      id: statusId == null ? "" : statusId,
    },
  });

  if (statusId == null) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <StatusDot color={null} size={size} />
        <span className="text-sm text-muted-foreground">Not set</span>
      </div>
    );
  }

  if (statusQuery.isError) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <ErrorRetry onRetry={() => statusQuery.refetch()} />
      </div>
    );
  }

  if (statusQuery.isPending) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Skeleton className={`h-3 w-3 rounded-full ${size}`} />
        <Skeleton className="h-3 w-20" />
      </div>
    );
  }

  const response = statusQuery.data?.body;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <StatusDot color={response?.color} size={size} title={response?.title} />
      <span className="text-sm truncate">{response?.title ?? "Not set"}</span>
    </div>
  );
};

export default StatusSummary;
