import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "./ui/skeleton";

export type ReportEntity = {
  id: number;
  title: string;
  createdTimestamp: string;
  launchesCount?: number;
};

type ReportListItemProps = {
  report: ReportEntity;
  selected: boolean;
  onClick: () => void;
};

export const ReportListItem = ({
  report,
  selected,
  onClick,
}: ReportListItemProps) => {
  return (
    <div>
      <button
        key={report.id}
        className={cn(
          "flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
          selected && "bg-muted"
        )}
        onClick={onClick}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{report.title}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <div className="text-xs font-medium">{report.title}</div> */}
            <div className={cn(
                "flex-nowrap text-xs",
                selected ? "text-foreground" : "text-muted-foreground"
              )}>
                <span className="inline">Launches: </span><LaunchesCount  count={report.launchesCount} />
            </div>
            
            <div
              className={cn(
                "ml-auto text-xs",
                selected ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Created: {formatDistanceToNow(new Date(report.createdTimestamp), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

type LaunchesCountProps = {
  count: number | undefined;
};

const LaunchesCount = ({ count }: LaunchesCountProps) => {
  if (count === undefined) {
    return <Skeleton className="bg-muted inline-block align-middle h-4 w-16 " />;
  } else {
    return <span className="text-xs font-medium">{count} launches</span>;
  }
};
