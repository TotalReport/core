import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export type LaunchEntity = {
  id: number;
  title: string;
  reportId: number;
  startedTimestamp?: string | null;
  finishedTimestamp?: string | null;
  createdTimestamp: string;
  correlationId: string;
  arguments?: string;
  argumentsHash: string;
};

type LaunchListItemProps = {
  launch: LaunchEntity;
  selected: boolean;
  onClick: () => void;
};

export const LaunchListItem = ({ launch, selected, onClick }: LaunchListItemProps) => {
  return (
    <div>
      <button
        key={launch.id}
        className={cn(
          "flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
          selected && "bg-muted"
        )}
        onClick={onClick}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">Launch #{launch.id}</div>
            </div>
            <div
              className={cn(
                "ml-auto text-xs",
                selected ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {launch.startedTimestamp == undefined ? (
                formatDistanceToNow(new Date(launch.createdTimestamp), {
                  addSuffix: true,
                })
              ) : (
                formatDistanceToNow(new Date(launch.startedTimestamp), {
                  addSuffix: true,
                })
              )}
            </div>
          </div>
          <div className="text-xs font-medium">{launch.title}</div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          Report ID: {launch.reportId}
        </div>
      </button>
    </div>
  );
};