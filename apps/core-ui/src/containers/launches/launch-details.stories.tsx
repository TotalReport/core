import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import LaunchDetails from "./launch-details.jsx";
import { ApiMock, TestEntitiesCountsByStatusesResponse } from "@/storybook/mocks/api-mock.js";
import {
  toStatusGroupResponse,
  toStatusResponse,
} from "@/storybook/converters/status-response.js";
import {
  DEFAULT_TEST_STATUSES,
  TEST_STATUS_GROUPS,
} from "@total-report/core-schema/constants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const apiMock = new ApiMock();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta: Meta<typeof LaunchDetails> = {
  title: "Containers/Launches/LaunchDetails",
  component: LaunchDetails,
  decorators: [
    (Story) => {
      queryClient.clear();
      return (
        <QueryClientProvider client={queryClient}>
          <div style={{ width: 800, height: 600 }}>
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof LaunchDetails>;

const exampleLaunch = {
  reportId: 1,
  id: 123,
  title: "Example Launch",
  createdTimestamp: new Date().toISOString(),
  startedTimestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  finishedTimestamp: new Date().toISOString(),
  arguments: "--env=ci --verbose",
};

// Sample statistics data for the launch — matches the shape expected by the
// TestsStatistics container and the API contract `findTestEntitiesCountsByStatuses`.
const launchTestEntitiesCounts: TestEntitiesCountsByStatusesResponse = [
  {
    entityType: "test",
    statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    count: 8,
  },
  {
    entityType: "test",
    statusGroupId: DEFAULT_TEST_STATUSES.FAILED.groupId,
    statusId: DEFAULT_TEST_STATUSES.FAILED.id,
    count: 2,
  },
  {
    entityType: "beforeTest",
    statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    count: 1,
  },
  { entityType: "afterTest", statusGroupId: null, statusId: null, count: 0 },
];

export const Success: Story = {
  args: { launchId: 123 },
  parameters: {
    msw: {
      handlers: [
        apiMock.readLaunch(123, exampleLaunch),
        apiMock.findTestEntitiesCountsByStatuses(
          { distinct: true, launchId: 123 },
          launchTestEntitiesCounts
        ),
        // Status reads for statuses referenced in the counts
        apiMock.readTestStatus(
          DEFAULT_TEST_STATUSES.PASSED.id,
          toStatusResponse(DEFAULT_TEST_STATUSES.PASSED)
        ),
        apiMock.readTestStatus(
          DEFAULT_TEST_STATUSES.FAILED.id,
          toStatusResponse(DEFAULT_TEST_STATUSES.FAILED)
        ),
        // Status group reads
        apiMock.readTestStatusGroup(
          TEST_STATUS_GROUPS.PASSED_GROUP.id,
          toStatusGroupResponse(TEST_STATUS_GROUPS.PASSED_GROUP)
        ),
        apiMock.readTestStatusGroup(
          TEST_STATUS_GROUPS.FAILED_GROUP.id,
          toStatusGroupResponse(TEST_STATUS_GROUPS.FAILED_GROUP)
        ),
      ],
    },
  },
};

export const Loading: Story = {
  args: { launchId: 123 },
  parameters: {
    msw: {
      handlers: [apiMock.readLaunchInfinite(123)],
    },
  },
};

export const Error: Story = {
  args: { launchId: 123 },
  parameters: {
    msw: {
      handlers: [apiMock.readLaunchCustom(123, 500, { error: "boom" })],
    },
  },
};

export const NoSelection: Story = {
  args: { launchId: null },
};
