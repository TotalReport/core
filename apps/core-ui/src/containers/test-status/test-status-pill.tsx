import { useFindStatusGroup } from "@/hooks/api/status-groups/use-find-status-group.jsx";
import { useFindStatus } from "@/hooks/api/statuses/use-find-status.jsx";
import { cn } from "@/lib/utils.js";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import ErrorRetry from "@/components/ui/error-retry.jsx";

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

  const groupId = statusQuery.data?.body?.groupId;

  const statusGroupQuery = useFindStatusGroup({
    enabled: groupId != undefined,
    filters: {
      id: groupId == undefined ? "" : groupId,
    },
  });

  if (statusId == undefined) {
    return (
      <div
        className={cn(
          "flex items-center justify-center text-muted-foreground",
          sizeClasses[size].undefinedText,
          className
        )}
      >
        - / -
      </div>
    );
  }

  // The order of checks is important here, because if status has error in response, the group can be in pending status, but we need to show error, not loading
  if (statusQuery.isError || statusGroupQuery.isError) {
    const handleRetry = () => {
      statusQuery.refetch();
      statusGroupQuery.refetch();
    };

    return (
      <ErrorRetry
        onRetry={handleRetry}
        className={cn(sizeClasses[size].undefinedText, className)}
        label="Err."
      />
    );
  }

  if (statusQuery.isPending || statusGroupQuery.isPending) {
    return (
      <div>
        <Skeleton className={skeletonStyle(size)} />
      </div>
    );
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
        style={getColorBackground(statusGroupQuery.data?.body?.color)}
      ></div>
      <div
        aria-label="Status Color"
        className={cn("h-full", sizeClasses[size].segment)}
        style={getColorBackground(statusQuery.data?.body?.color)}
      ></div>
    </div>
  );
};

function skeletonStyle(size: "sm" | "md") {
  return cn(sizeClasses[size].skeleton);
}

const sizeClasses = {
  sm: {
    container: "h-2",
    segment: "w-2",
    skeleton: "h-2 w-5",
    undefinedWidth: "w-8",
    undefinedText: "text-xs",
  },
  md: {
    container: "h-3",
    segment: "w-3",
    skeleton: "h-3 w-7",
    undefinedWidth: "w-10",
    undefinedText: "text-sm",
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
