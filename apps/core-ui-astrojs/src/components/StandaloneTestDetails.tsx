import { tsr } from "@/lib/react-query";
import { contract } from "@total-report/core-contract/contract";
import type { ClientInferResponseBody } from "@ts-rest/core";
import { useEffect, useState, useRef, useCallback } from "react";
import { getNullableUrlParamNumber, getUrlParamNumber } from "../lib/url-utils";
import { TestDetails } from "./TestDetails";
import { RestAPIProvider } from "./RestAPIProvider";
import { type Entity } from "./tests-list-item";

// Define the possible test types
type TestType = 'test' | 'beforeTest' | 'afterTest';

const Internal = () => {
  // Function to get current test parameters from URL
  const getTestParamsFromUrl = () => {
    const testId = getNullableUrlParamNumber("testId");
    const beforeTestId = getNullableUrlParamNumber("beforeTestId");
    const afterTestId = getNullableUrlParamNumber("afterTestId");
    
    // Determine which test type to show based on URL params
    let currentType: TestType = 'test';
    if (beforeTestId != null) currentType = 'beforeTest';
    else if (afterTestId != null) currentType = 'afterTest';
    
    return {
      testId: testId != null ? testId : null,
      beforeTestId: beforeTestId != null ? beforeTestId : null,
      afterTestId: afterTestId != null ? afterTestId : null,
      currentType
    };
  };

  // Get test IDs from URL parameters
  const [testParams, setTestParams] = useState(() => getTestParamsFromUrl());
  
  // Use a callback for checking URL params to avoid recreating it on every render
  const checkUrlParams = useCallback(() => {
    const newParams = getTestParamsFromUrl();
    
    // Only update state if something has changed
    if (
      newParams.testId !== testParams.testId ||
      newParams.beforeTestId !== testParams.beforeTestId ||
      newParams.afterTestId !== testParams.afterTestId ||
      newParams.currentType !== testParams.currentType
    ) {
      setTestParams(newParams);
    }
  }, [testParams]);

  // Listen for URL changes
  useEffect(() => {
    // Check immediately on mount
    checkUrlParams();
    
    // Function handler for URL changes
    const handleUrlChange = () => {
      checkUrlParams();
    };
    
    // Listen for both our custom event and popstate
    window.addEventListener('urlchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    
    // Clean up
    return () => {
      window.removeEventListener('urlchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [checkUrlParams]);

  // Skip URL updates from this component to avoid loops
  const isUpdatingUrl = useRef(false);
  
  // Update URL when test IDs change
  useEffect(() => {
    if (typeof window !== "undefined" && !isUpdatingUrl.current) {
      isUpdatingUrl.current = true;
      
      const url = new URL(window.location.href);
      
      // Keep page and pageSize parameters
      const page = url.searchParams.get("page");
      const pageSize = url.searchParams.get("pageSize");
      
      // Clear all test IDs first
      url.searchParams.delete("testId");
      url.searchParams.delete("beforeTestId");
      url.searchParams.delete("afterTestId");
      
      // Then set the active one
      if (testParams.currentType === 'test' && testParams.testId) {
        url.searchParams.set("testId", testParams.testId.toString());
      } else if (testParams.currentType === 'beforeTest' && testParams.beforeTestId) {
        url.searchParams.set("beforeTestId", testParams.beforeTestId.toString());
      } else if (testParams.currentType === 'afterTest' && testParams.afterTestId) {
        url.searchParams.set("afterTestId", testParams.afterTestId.toString());
      }
      
      // Restore page and pageSize if they existed
      if (page) url.searchParams.set("page", page);
      if (pageSize) url.searchParams.set("pageSize", pageSize);
      
      window.history.replaceState({}, "", url.toString());
      
      // Reset flag after a small delay to ensure events are processed
      setTimeout(() => {
        isUpdatingUrl.current = false;
      }, 0);
    }
  }, [testParams]);

  // Fetch test data based on the current test type
  const testQuery = tsr.readTest.useQuery({
    queryKey: [`test-${testParams.testId}`],
    queryData: {
      params: {
        id: testParams.testId || 0,
      },
    },
    enabled: testParams.currentType === 'test' && testParams.testId !== null,
  });

  const beforeTestQuery = tsr.readBeforeTest.useQuery({
    queryKey: [`beforeTest-${testParams.beforeTestId}`],
    queryData: {
      params: {
        id: testParams.beforeTestId || 0,
      },
    },
    enabled: testParams.currentType === 'beforeTest' && testParams.beforeTestId !== null,
  });

  const afterTestQuery = tsr.readAfterTest.useQuery({
    queryKey: [`afterTest-${testParams.afterTestId}`],
    queryData: {
      params: {
        id: testParams.afterTestId || 0,
      },
    },
    enabled: testParams.currentType === 'afterTest' && testParams.afterTestId !== null,
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
    switch (testParams.currentType) {
      case 'test': return testQuery;
      case 'beforeTest': return beforeTestQuery;
      case 'afterTest': return afterTestQuery;
    }
  };

  // Get the current test ID based on test type
  const getCurrentId = () => {
    switch (testParams.currentType) {
      case 'test': return testParams.testId;
      case 'beforeTest': return testParams.beforeTestId;
      case 'afterTest': return testParams.afterTestId;
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
          testParams.currentType
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
