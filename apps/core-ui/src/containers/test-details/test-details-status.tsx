import {
  useFindStatusGroup
} from "@/hooks/api/status-groups/use-find-status-group.jsx";
import {
  useFindStatus
} from "@/hooks/api/statuses/use-find-status.jsx";
import { Skeleton } from "../../components/ui/skeleton.jsx";
import { StatusPill } from "../../components/ui/status-pill.jsx";

type TestDetailsStatusProps = {
  statusId: string | undefined;
};

export const TestDetailsStatus = ({ statusId }: TestDetailsStatusProps) => {
  const statusQuery = useFindStatus({
    enabled: statusId != undefined,
    filters: { id: statusId == undefined ? "" : statusId },
  });
  const statusGroupQuery = useFindStatusGroup({
    enabled: !statusQuery.isPending,
    filters: {
      id:
        statusQuery.data?.groupId == undefined ? "" : statusQuery.data?.groupId,
    },
  });

  if (statusQuery.isError || statusGroupQuery.isError) {
    return <div>Error loading status information</div>;
  }

  return (
    <div className="mt-2 flex items-center">
      <StatusPill statusId={statusId} size="md" />
      <span className="ml-2 text-sm font-medium">
        {statusText(statusQuery, statusGroupQuery)}
      </span>
    </div>
  );
};

const statusText = (
  statusQuery: Exclude<ReturnType<typeof useFindStatus>, { isError: true }>,
  statusGroupQuery: Exclude<
    ReturnType<typeof useFindStatusGroup>,
    { isError: true }
  >
) => {
  if (statusQuery.isPending || statusGroupQuery.isPending) {
    return (
      <>
        <Skeleton /> / <Skeleton />
      </>
    );
  }

  if (!statusQuery.isEnabled || !statusGroupQuery.isEnabled) {
    return <>Undefined status</>;
  }

  return (
    <>
      {statusGroupQuery.data.title} / {statusQuery.data.title}
    </>
  );
};
