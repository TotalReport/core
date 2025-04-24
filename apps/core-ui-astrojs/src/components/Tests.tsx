import { tsr } from "@/lib/react-query";
import { contract } from "@total-report/core-contract/contract";
import type { ClientInferResponseBody } from "@ts-rest/core";
import { useEffect, useState } from "react";
import { PaginationBlock } from "./pagination-block";
import { RestAPIProvider } from "./RestAPIProvider";
import { TestListItem, type Entity } from "./tests-list-item";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { totalPagesCount } from "@/lib/pagination-utils";
import { getUrlParamNumber } from "../lib/url-utils";

const Internal = () => {
  const tsrQueryClient = tsr.useQueryClient();

  const [page, setPage] = useState(() => Math.max(1, getUrlParamNumber("page", 1)));
  const [pageSize, setPageSize] = useState(() => Math.max(1, getUrlParamNumber("pageSize", 10)));
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  const testEntities = tsr.findTestEntities.useQuery({
    queryKey: [`tests?page=${page}&pageSize=${pageSize}`],
    queryData: {
      query: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
      },
    },
  });

  useEffect(() => {
    if (page < 1) setPage(1);
    
    if (pageSize < 1) setPageSize(10);
    
    if (!testEntities.isPending) {
      const totalPages = totalPagesCount(
        testEntities.data?.body.pagination.total || 0,
        pageSize
      );

      if (page > totalPages) {
        setPage(totalPages);
      }
    }
    
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("pageSize", pageSize.toString());
      window.history.replaceState({}, "", url.toString());
    }
  }, [page, pageSize, testEntities]);

  const statuses = tsr.findTestStatuses.useQuery({
    queryKey: ["findTestStatuses"],
  });

  const statusGroups = tsr.findTestStatusGroups.useQuery({
    queryKey: ["findTestStatusGroups"],
  });

  // Function to generate URL for pagination links
  const getHref = (newPage: number, newPageSize: number) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", newPage.toString());
      url.searchParams.set("pageSize", newPageSize.toString());
      return url.toString();
    }
    return "";
  };

  const selectedTest = testEntities.data?.body?.items.find(
    (test) => test.id === selectedTestId
  );

  const formattedSelectedTest = selectedTest
    ? formatTest(
        selectedTest,
        statuses.data?.body.items || [],
        statusGroups.data?.body.items || []
      )
    : null;

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full border items-stretch"
    >
      <ResizablePanel
        autoSave="true"
        defaultValue={20}
        collapsible={false}
        minSize={25}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">Tests</h1>
          </div>
          <Separator />
          <ScrollArea className="flex-1 overflow-hidden">
            {(testEntities.isPending ||
              statuses.isPending ||
              statusGroups.isPending) && <p className="p-4">Loading...</p>}
            {!(
              testEntities.isPending ||
              statuses.isPending ||
              statusGroups.isPending
            ) &&
              testEntities.data?.body?.items.length === 0 && (
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
            {!(
              testEntities.isPending ||
              statuses.isPending ||
              statusGroups.isPending
            ) &&
              testEntities.data?.body?.items != undefined &&
              testEntities.data?.body?.items.length > 0 && (
                <div className="flex flex-col gap-2 p-2">
                  {testEntities.data.body.items.map((test) => (
                    <TestListItem
                      key={test.id}
                      entity={formatTest(
                        test,
                        statuses.data?.body.items!,
                        statusGroups.data?.body.items!
                      )}
                      selected={test.id === selectedTestId}
                      onClick={() => setSelectedTestId(test.id)}
                    />
                  ))}
                </div>
              )}
          </ScrollArea>
          <PaginationBlock
            page={page}
            pageSize={pageSize}
            totalItems={testEntities.data?.body.pagination.total!}
            setPage={setPage}
            setPageSize={setPageSize}
          ></PaginationBlock>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <TestDetails test={formattedSelectedTest} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

// Component to display test details in the right panel
const TestDetails = ({ test }: { test: Entity | null }) => {
  if (!test) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            Select a test to view details
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-bold">{test.title}</h2>
          {test.status && (
            <div className="mt-2 flex items-center">
              <div className="flex h-3 overflow-hidden rounded-full border border-muted-foreground">
                <div
                  className="h-full w-3"
                  style={{ backgroundColor: test.status.group.color }}
                ></div>
                <div
                  className="h-full w-3"
                  style={{ backgroundColor: test.status.color }}
                ></div>
              </div>
              <span className="ml-2 text-sm font-medium">
                {test.status.name} ({test.status.group.name})
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">ID</p>
            <p className="font-medium">{test.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">{test.entityType}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Created</p>
            <p className="font-medium">
              {new Date(test.createdTimestamp).toLocaleString()}
            </p>
          </div>
          {test.startedTimestamp && (
            <div>
              <p className="text-muted-foreground">Started</p>
              <p className="font-medium">
                {new Date(test.startedTimestamp).toLocaleString()}
              </p>
            </div>
          )}
          {test.finishedTimestamp && (
            <div>
              <p className="text-muted-foreground">Finished</p>
              <p className="font-medium">
                {new Date(test.finishedTimestamp).toLocaleString()}
              </p>
            </div>
          )}
          {test.correlationId && (
            <div>
              <p className="text-muted-foreground">Correlation ID</p>
              <p className="font-medium">{test.correlationId}</p>
            </div>
          )}
        </div>

        {test.argumentsHash && (
          <div>
            <p className="text-muted-foreground">Arguments Hash</p>
            <p className="font-mono text-xs bg-muted p-2 rounded mt-1 overflow-auto">
              {test.argumentsHash}
            </p>
          </div>
        )}
      </div>
    </div>
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
    correlationId: test.correlationId,
    argumentsHash: test.argumentsHash,
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
