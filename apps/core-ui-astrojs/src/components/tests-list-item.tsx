import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { StatusPill, type StatusEntity } from "./StatusPill";

export type Entity = {
  id: number;
  title: string;
  status:
    | StatusEntity
    | undefined;
  startedTimestamp?: string | null;
  finishedTimestamp?: string | null;
  createdTimestamp: string;
  entityType: string;
  correlationId?: string | null;
  argumentsHash?: string | null;
};

type TestListItemProps = {
  entity: Entity;
  selected: boolean;
  onClick: () => void;
};

export const TestListItem = ({ entity, selected, onClick }: TestListItemProps) => {
  return (
    <div>
      <button
        key={entity.id}
        className={cn(
          "flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
          selected && "bg-muted"
        )}
        onClick={onClick}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              {entity.status ? (
                <div className="relative flex items-center">
                  <StatusPill 
                    status={entity.status}
                    size="sm"
                  />
                  <span className="ml-2 font-semibold">{entity.status.name}</span>
                </div>
              ) : (
                <div className="font-semibold">No Status</div>
              )}
            </div>
            <div
              className={cn(
                "ml-auto text-xs",
                selected ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {entity.startedTimestamp == undefined ? (
                <></>
              ) : (
                formatDistanceToNow(new Date(entity.startedTimestamp), {
                  addSuffix: true,
                })
              )}
            </div>
          </div>
          <div className="text-xs font-medium">{entity.title}</div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          {/* {item.text.substring(0, 300)} */}
        </div>
        {/* {item.labels.length ? (
          <div className="flex items-center gap-2">
            {item.labels.map((label) => (
              <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                {label}
              </Badge>
            ))}

          </div>
        ) : null} */}
      </button>
    </div>
  );
};
