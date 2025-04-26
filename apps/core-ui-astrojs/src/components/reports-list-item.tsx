import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export type ReportEntity = {
  id: number;
  title: string;
  createdTimestamp: string;
};

type ReportListItemProps = {
  report: ReportEntity;
  selected: boolean;
  onClick: () => void;
};

export const ReportListItem = ({ report, selected, onClick }: ReportListItemProps) => {
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
              <div className="font-semibold">Report #{report.id}</div>
            </div>
            <div
              className={cn(
                "ml-auto text-xs",
                selected ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {formatDistanceToNow(new Date(report.createdTimestamp), {
                addSuffix: true,
              })}
            </div>
          </div>
          <div className="text-xs font-medium">{report.title}</div>
        </div>
      </button>
    </div>
  );
};