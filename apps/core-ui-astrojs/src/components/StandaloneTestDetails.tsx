import { tsr } from "@/lib/react-query";
import { contract } from "@total-report/core-contract/contract";
import type { ClientInferResponseBody } from "@ts-rest/core";
import { TestDetails } from "./TestDetails";
import { RestAPIProvider } from "./RestAPIProvider";
import { type Entity } from "./tests-list-item";
import { useTestDetailsParams } from "@/lib/hooks/useUrlParam";

// Define the possible test types
type TestType = 'test' | 'beforeTest' | 'afterTest';

const Internal = () => {
  // Use our custom hook to manage test URL parameters
  const { testId, beforeTestId, afterTestId, currentType } = useTestDetailsParams();

  // Fetch test data based on the current test type
  const testQuery = tsr.readTest.useQuery({
    queryKey: [`test-${testId}`],
    queryData: {
      params: {
        id: testId || 0,
      },
    },
    enabled: currentType === 'test' && testId !== null,
  });

  const beforeTestQuery = tsr.readBeforeTest.useQuery({
    queryKey: [`beforeTest-${beforeTestId}`],
    queryData: {
      params: {
        id: beforeTestId || 0,
      },
    },
    enabled: currentType === 'beforeTest' && beforeTestId !== null,
  });

  const afterTestQuery = tsr.readAfterTest.useQuery({
    queryKey: [`afterTest-${afterTestId}`],
    queryData: {
      params: {
        id: afterTestId || 0,
      },
    },
    enabled: currentType === 'afterTest' && afterTestId !== null,
  });

  // Fetch statuses and status groups for formatting
  const statuses = tsr.findTestStatuses.useQuery({
    queryKey: ["findTestStatuses"],
  });

  const statusGroups = tsr.findTestStatusGroups.useQuery({
    queryKey: ["findTestStatusGroups"],
  });

  // Get the current query based on test type
  const getCurrentQuery = () => {
    switch (currentType) {
      case 'test': return testQuery;
      case 'beforeTest': return beforeTestQuery;
      case 'afterTest': return afterTestQuery;
    }
  };

  // Get the current test ID based on test type
  const getCurrentId = () => {
    switch (currentType) {
      case 'test': return testId;
      case 'beforeTest': return beforeTestId;
      case 'afterTest': return afterTestId;
    }
  };

  const currentQuery = getCurrentQuery();
  const currentId = getCurrentId();
  
  // Format the test data with statuses
  const formattedTest = !currentId || currentQuery.isPending || statuses.isPending || statusGroups.isPending 
    ? null 
    : currentQuery.data?.status === 200 
      ? formatTest(
          currentQuery.data.body,
          statuses.data?.body.items || [],
          statusGroups.data?.body.items || [],
          currentType
        )
      : null;

  return (
    <TestDetails test={formattedTest} />
  );
};

// Define the entity types from different API responses
type TestEntity = ClientInferResponseBody<
  typeof contract.readTest,
  200
>;

type BeforeTestEntity = ClientInferResponseBody<
  typeof contract.readBeforeTest,
  200
>;

type AfterTestEntity = ClientInferResponseBody<
  typeof contract.readAfterTest,
  200
>;

type Status = ClientInferResponseBody<
  typeof contract.findTestStatuses,
  200
>["items"][0];

type StatusGroup = ClientInferResponseBody<
  typeof contract.findTestStatusGroups,
  200
>["items"][0];

// Common function to format test data regardless of test type
function formatTest(
  test: TestEntity | BeforeTestEntity | AfterTestEntity,
  statuses: Status[],
  statusGroups: StatusGroup[],
  entityType: TestType
): Entity {
  return {
    id: test.id,
    title: test.title,
    status: formatStatus(test.statusId, statuses, statusGroups),
    createdTimestamp: test.createdTimestamp,
    startedTimestamp: test.startedTimestamp,
    finishedTimestamp: test.finishedTimestamp,
    entityType: entityType === 'test' ? 'test' : 
                entityType === 'beforeTest' ? 'before test' : 'after test',
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
  const status = statuses.find((status) => status.id === statusId);
  if (!status) return undefined;

  const group = statusGroups.find((group) => group.id === status.groupId);
  if (!group) return undefined;

  return {
    id: status.id,
    name: status.title,
    color: status.color,
    createdTimestamp: status.createdTimestamp,
    group: {
      id: group.id,
      name: group.title,
      color: group.color,
      createdTimestamp: group.createdTimestamp,
    },
  };
}

export const StandaloneTestDetails = () => {
  return (
    <RestAPIProvider>
      <Internal />
    </RestAPIProvider>
  );
};
