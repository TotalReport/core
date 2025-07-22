import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils.js';
import { LaunchEntity } from '@/hooks/api/launches/use-find-launches.js';

interface LaunchItemProps {
  launch: LaunchEntity;
  selected: boolean;
  onClick: () => void;
}

export default function LaunchItem({ launch, selected, onClick }: LaunchItemProps) {
  return (
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
            {launch.startedTimestamp ? 
              formatDistanceToNow(new Date(launch.startedTimestamp), { addSuffix: true }) : 
              formatDistanceToNow(new Date(launch.createdTimestamp), { addSuffix: true })}
          </div>
        </div>
        <div className="text-xs font-medium">{launch.title}</div>
      </div>
      <div className="line-clamp-2 text-xs text-muted-foreground">
        Report ID: {launch.reportId}
      </div>
    </button>
  );
}
