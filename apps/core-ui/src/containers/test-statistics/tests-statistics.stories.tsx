import {
  toStatusGroupResponse,
  toStatusResponse,
} from "@/storybook/converters/status-response.js";
import {
  ApiMock,
  TestEntitiesCountsByStatusesResponse,
} from "@/storybook/mocks/api-mock.js";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DEFAULT_TEST_STATUSES,
  TEST_STATUS_GROUPS,
} from "@total-report/core-schema/constants";
import { TestsStatistics } from "./tests-statistics.jsx";

const apiMock = new ApiMock();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta: Meta<typeof TestsStatistics> = {
  title: "Containers/TestsStatistics/TestsStatistics",
  component: TestsStatistics,
  decorators: [
    (Story) => {
      queryClient.clear();
      return (
        <QueryClientProvider client={queryClient}>
          <div style={{ width: 420 }}>
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof TestsStatistics>;

const testEntitiesCounts: TestEntitiesCountsByStatusesResponse = [
  {
    entityType: "test",
    statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    count: 12,
  },
  {
    entityType: "test",
    statusGroupId: DEFAULT_TEST_STATUSES.FAILED.groupId,
    statusId: DEFAULT_TEST_STATUSES.FAILED.id,
    count: 3,
  },
  {
    entityType: "beforeTest",
    statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    count: 2,
  },
  { entityType: "afterTest", statusGroupId: null, statusId: null, count: 1 },
];

export const Success: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        apiMock.findTestEntitiesCountsByStatuses(
          { distinct: true },
          testEntitiesCounts
        ),
        apiMock.readTestStatus(
          DEFAULT_TEST_STATUSES.PASSED.id,
          toStatusResponse(DEFAULT_TEST_STATUSES.PASSED)
        ),
        apiMock.readTestStatus(
          DEFAULT_TEST_STATUSES.FAILED.id,
          toStatusResponse(DEFAULT_TEST_STATUSES.FAILED)
        ),
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
    docs: {
      description: {
        story: "Displays grouped test entity statistics by status.",
      },
    },
  },
};

export const Loading: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        // infinite loading for counts
        apiMock.findTestEntitiesCountsByStatusesInfinite({ distinct: true }),
      ],
    },
    docs: { description: { story: "Loading state for test statistics." } },
  },
};

export const Error: Story = {
  args: {},
  parameters: {
    msw: {
      handlers: [
        apiMock.findTestEntitiesCountsByStatusesCustom(
          { distinct: true },
          500,
          { error: "server error" }
        ),
      ],
    },
    docs: {
      description: { story: "Error state when statistics cannot be loaded." },
    },
  },
};
