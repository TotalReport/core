import { useFindStatusGroup } from "@/hooks/api/status-groups/use-find-status-group.jsx";
import { useFindStatus } from "@/hooks/api/statuses/use-find-status.jsx";
import { cn } from "@/lib/utils.js";
import { Skeleton } from "./skeleton.jsx";

export type StatusPillProps = {
  statusId: string | undefined;
  size?: "sm" | "md";
  className?: string;
};

export const StatusPill = ({
  statusId,
  size = "sm",
  className,
}: StatusPillProps) => {
  const statusQuery = useFindStatus({
    enabled: statusId != undefined,
    filters: { id: statusId == undefined ? "" : statusId },
  });
  const statusGroupQuery = useFindStatusGroup({
    enabled: !statusQuery.isPending,
    filters: {
      id:
        statusQuery.data?.groupId == undefined ? "" : statusQuery.data?.groupId,
    },
  });

  if (statusQuery.isPending || statusGroupQuery.isPending) {
    return (
      <div>
        <Skeleton />
      </div>
    );
  }

  if (statusQuery.isError || statusGroupQuery.isError) {
    return <div>Error loading status information</div>;
  }

  return (
    <div
      className={cn(
        "flex overflow-hidden rounded-full border border-muted-foreground",
        sizeClasses[size].container,
        className
      )}
    >
      <div
        aria-label="Status Group Color"
        className={cn("h-full", sizeClasses[size].segment)}
        style={getColorBackground(statusGroupQuery.data?.color)}
      ></div>
      <div
        aria-label="Status Color"
        className={cn("h-full", sizeClasses[size].segment)}
        style={getColorBackground(statusQuery.data?.color)}
      ></div>
    </div>
  );
};

const sizeClasses = {
  sm: {
    container: "h-2",
    segment: "w-2",
  },
  md: {
    container: "h-3",
    segment: "w-3",
  },
};

const getColorBackground = (color?: string | undefined) => {
  if (color == undefined) {
    return undefinedStatusPillStyles;
  }
  return { backgroundColor: color };
};

const undefinedStatusPillStyles = {
  backgroundImage: `
        linear-gradient(45deg, #ccc 25%, transparent 26%), 
        linear-gradient(-45deg, #ccc 25%, transparent 26%),
        linear-gradient(45deg, transparent 74%, #ccc 75%),
        linear-gradient(-45deg, transparent 74%, #ccc 75%)
      `,
  backgroundSize: "8px 8px",
  backgroundPosition: "1px 1px, 1px 5px, 5px -3px, -3px 0px",
  backgroundColor: "#e9e9e9",
};
