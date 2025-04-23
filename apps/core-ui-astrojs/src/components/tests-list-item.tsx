import { cn } from "@/lib/utils";
import { contract } from "@total-report/core-contract/contract";
import type { ClientInferResponseBody } from "@ts-rest/core";
import { formatDistanceToNow } from "date-fns";

type TestEntity = ClientInferResponseBody<
  typeof contract.findTestEntities,
  200
>["items"][0];

type TestListItemProps = {
  entity: TestEntity;
  selected: boolean;
};

export const TestListItem = ({ entity, selected }: TestListItemProps) => {
  return (
    <div>
      <button
        key={entity.id}
        className={cn(
          "flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
          selected && "bg-muted"
        )}
        onClick={() => {
          // TODO set selected test
        }}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{entity.statusId}</div>
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
