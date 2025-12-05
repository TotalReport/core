import { useFindStatusGroup } from "@/hooks/api/status-groups/use-find-status-group.jsx";
import { useFindStatus } from "@/hooks/api/statuses/use-find-status.jsx";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import {ErrorRetry} from "@/components/ui/error-retry.jsx";
import { StatusPill } from "../test-status/test-status-pill.jsx";

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

  if (statusQuery.isError || statusGroupQuery.isError) {
    const handleRetry = () => {
      statusQuery.refetch();
      statusGroupQuery.refetch();
    };

    return (
      <div className="mt-2 flex items-baseline">
        <ErrorRetry onRetry={handleRetry} />
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
