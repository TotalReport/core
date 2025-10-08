import { useFindStatusGroup } from "@/hooks/api/status-groups/use-find-status-group.jsx";
import { useFindStatus } from "@/hooks/api/statuses/use-find-status.jsx";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import { StatusPill } from "../status/status-pill.jsx";

type TestDetailsStatusProps = {
  statusId: string | undefined;
};

export const TestDetailsStatus = ({ statusId }: TestDetailsStatusProps) => {
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
      <div className="mt-2 flex items-baseline text-muted-foreground text-sm">
        — / —
      </div>
    );
  }

  // Error: show retry affordance similar to StatusPill
  if (statusQuery.isError || statusGroupQuery.isError) {
    const handleRetry = () => {
      statusQuery.refetch();
      statusGroupQuery.refetch();
    };

    return (
      <div className="mt-2 flex items-baseline">
        <button
          onClick={handleRetry}
          className="text-sm flex items-center gap-1 text-error-foreground hover:brightness-200 focus:outline-none focus:ring-2 focus:ring-error-foreground focus:ring-offset-1 rounded transition-colors"
          title="Error loading status. Click to retry."
        >
          Error 
          <span className="inline-block">↻</span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-baseline">
      <StatusPill statusId={statusId} size="md" />
      <span className="ml-2 text-sm font-medium">{statusText(statusQuery, statusGroupQuery)}</span>
    </div>
  );
};

function statusText(
  statusQuery: ReturnType<typeof useFindStatus>,
  statusGroupQuery: ReturnType<typeof useFindStatusGroup>
) {
  if (statusQuery.isPending || statusGroupQuery.isPending) {
    return (
      <>
        <div className="flex items-center">
          <Skeleton className="h-3 w-16" />
          &nbsp;
          <Skeleton className="h-3 w-16" />
        </div>
      </>
    );
  }

  return (
    <>
      {statusGroupQuery.data?.body?.title} / {statusQuery.data?.body?.title}
    </>
  );
};
