import { cn } from '@/lib/utils.js';
import { formatDistanceToNow } from 'date-fns';
import { FormattedTestEntity } from '@/lib/test-utils.js';
import { StatusPill } from '@/components/ui/status-pill.js';

type TestListItemProps = {
  test: FormattedTestEntity;
  selected: boolean;
  onClick: () => void;
};

export const TestListItem = ({ test, selected, onClick }: TestListItemProps) => {
  return (
    <div>
      <button
        className={cn(
          'flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
          selected && 'bg-muted'
        )}
        onClick={onClick}
      >
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              {test.status ? (
                <div className="relative flex items-center">
                  <StatusPill
                    statusId={test.status.id}
                    size="sm"
                  />
                  <span className="ml-2 font-semibold">{test.status.name}</span>
                </div>
              ) : (
                <div className="font-semibold">No Status</div>
              )}
            </div>
            <div
              className={cn(
                'ml-auto text-xs',
                selected ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {test.startedTimestamp ? (
                formatDistanceToNow(new Date(test.startedTimestamp), {
                  addSuffix: true,
                })
              ) : (
                formatDistanceToNow(new Date(test.createdTimestamp), {
                  addSuffix: true,
                })
              )}
            </div>
          </div>
          <div className="text-xs font-medium">{test.title}</div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="font-medium">Type:</span>
            <span>{test.entityType}</span>
          </span>
          {test.correlationId && (
            <>
              <span className="mx-2">•</span>
              <span className="inline-flex items-center gap-1">
                <span className="font-medium">ID:</span>
                <span className="truncate">{test.correlationId}</span>
              </span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};
