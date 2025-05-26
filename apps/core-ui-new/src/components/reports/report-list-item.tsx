'use client';

import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { ReportEntity } from '@/types/reports';

interface ReportListItemProps {
  report: ReportEntity;
  selected: boolean;
  onClick: () => void;
}

export const ReportListItem = ({
  report,
  selected,
  onClick,
}: ReportListItemProps) => {
  return (
    <div>
      <button
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
            <div
              className={cn(
                "ml-auto text-xs",
                selected ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Created {formatDistanceToNow(new Date(report.createdTimestamp), {
                addSuffix: true,
              })}
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
