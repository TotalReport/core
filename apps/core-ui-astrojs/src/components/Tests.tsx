import { tsr } from "@/lib/react-query";
import { contract } from "@total-report/core-contract/contract";
import type { ClientInferResponseBody } from "@ts-rest/core";
import { RestAPIProvider } from "./RestAPIProvider";
import { TestListItem, type Entity } from "./tests-list-item";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { Separator } from "./ui/separator";

const Internal = () => {
  const tsrQueryClient = tsr.useQueryClient();

  const { data, isPending } = tsr.findTestEntities.useQuery({
    queryKey: ["findTestEntities"],
  });

  const statuses = tsr.findTestStatuses.useQuery({
    queryKey: ["findTestStatuses"],
  });

  const statusGroups = tsr.findTestStatusGroups.useQuery({
    queryKey: ["findTestStatusGroups"],
  });

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full border items-stretch"
    >
      <ResizablePanel
        autoSave="true"
        defaultValue={20}
        collapsible={false}
        minSize={15}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Tests</h1>
          </div>
          <Separator />
          {(isPending || statuses.isPending || statusGroups.isPending) && (
            <p className="p-4">Loading...</p>
          )}
          {!(isPending || statuses.isPending || statusGroups.isPending) &&
            data?.body?.items.length === 0 && (
              <div className="flex items-center justify-center flex-grow">
                <div className="text-center">
                  <p className="text-lg font-bold text-secondary-foreground">
                    No tests found
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting filters
                  </p>
                </div>
              </div>
            )}
          {!(isPending || statuses.isPending || statusGroups.isPending) &&
            data?.body?.items != undefined &&
            data?.body?.items.length > 0 && (
              <div className="flex flex-col gap-2 p-2">
                {data.body.items.map((test) => (
                  <TestListItem
                    entity={formatTest(
                      test,
                      statuses.data?.body.items!,
                      statusGroups.data?.body.items!
                    )}
                    selected={false}
                  />
                ))}
              </div>
            )}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel></ResizablePanel>
    </ResizablePanelGroup>
  );
};

type TestEntity = ClientInferResponseBody<
  typeof contract.findTestEntities,
  200
>["items"][0];

type Status = ClientInferResponseBody<
  typeof contract.findTestStatuses,
  200
>["items"][0];

type StatusGroup = ClientInferResponseBody<
  typeof contract.findTestStatusGroups,
  200
>["items"][0];

function formatTest(
  test: TestEntity,
  statuses: Status[],
  statusGroups: StatusGroup[]
): Entity {
  return {
    id: test.id,
    title: test.title,
    status: formatStatus(test.statusId, statuses, statusGroups),
    createdTimestamp: test.createdTimestamp,
    startedTimestamp: test.startedTimestamp,
    finishedTimestamp: test.finishedTimestamp,
    entityType: test.entityType,
  };
}

function formatStatus(
  statusId: string | undefined,
  statuses: Status[],
  statusGroups: StatusGroup[]
): Entity["status"] {
  if (!statusId) return undefined;
  const status = statuses.find((status) => status.id === statusId)!;

  const group = statusGroups.find((group) => group.id === status.groupId)!;

  return {
    id: status.id,
    name: status.title,
    color: status.color,
    group: {
      id: group.id,
      name: group.title,
      color: group.color,
    },
  };
}

export const TestsList = () => {
  return (
    <RestAPIProvider>
      <Internal />
    </RestAPIProvider>
  );
};
