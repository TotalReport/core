import { useFindStatusGroup } from "@/hooks/api/status-groups/use-find-status-group.jsx";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { StatusCount } from "./status-count.jsx";
import { StatusDot } from "./status-dot.jsx";
import { Skeleton } from "../../components/ui/skeleton.jsx";

export type StatusGroupDetailProps = {
  /**
   * The ID of the status group where the statuses belong.
   */
  groupId: string | null;
  /**
   * Map of status IDs to their counts within this group.
   */
  counts: Map<string | null, number>;
};

export const StatusGroupDetail = ({
  groupId,
  counts,
}: StatusGroupDetailProps) => {
  // Only enable the query when we have a concrete group id (null means "not set")
  const statusGroupQuery = useFindStatusGroup({
    enabled: groupId != null,
    filters: {
      id: groupId == null ? "" : groupId,
    },
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const statusGroupResponse = statusGroupQuery.data?.body;

  const totalCount =
    counts.size === 0
      ? 0
      : Array.from(counts.values()).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <ExpandableChevron isExpanded={isExpanded} />
          {/* Dot area: show a small rounded skeleton while loading */}
          {groupId != null && statusGroupQuery.isPending ? (
            <Skeleton className="h-3 w-3 rounded-full mr-2" />
          ) : (
            <StatusDot color={statusGroupResponse?.color} size="w-3 h-3 mr-2" />
          )}
          {/* Title area: show skeleton when loading, error button when failed, or fallback when groupId is null */}
          {groupId != null && statusGroupQuery.isPending ? (
            <Skeleton className="h-4 w-28 mr-2" />
          ) : statusGroupQuery.isError ? (
            <button
              onClick={() => statusGroupQuery.refetch()}
              className="flex items-center gap-1 text-error-foreground hover:brightness-200 focus:outline-none focus:ring-2 focus:ring-error-foreground focus:ring-offset-1 rounded transition-colors"
              title="Error loading status group. Click to retry."
            >
              Err.
              <span className="inline-block">↻</span>
            </button>
          ) : (
            <span>{statusGroupResponse?.title ?? "Not set"}</span>
          )}
          <span className="ml-2 text-sm text-muted-foreground">
            ({totalCount})
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="pl-6 mt-2 space-y-2">
          {Array.from(counts.entries()).map(([statusId, count], idx) => (
            <StatusCount key={idx} statusId={statusId} count={count} />
          ))}
        </div>
      )}
    </div>
  );
};

const ExpandableChevron = ({ isExpanded }: { isExpanded: boolean }) => {
  return isExpanded ? (
    <ChevronDown className="h-4 w-4 mr-1" />
  ) : (
    <ChevronRight className="h-4 w-4 mr-1" />
  );
};
