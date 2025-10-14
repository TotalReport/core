import {
  toStatusGroupResponse,
  toStatusResponse,
} from "@/storybook/converters/status-response.js";
import { ApiMock } from "@/storybook/mocks/api-mock.js";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DEFAULT_TEST_STATUSES,
  TEST_STATUS_GROUPS,
} from "@total-report/core-schema/constants";
import { StatusGroupDetail } from "./status-group-detail.jsx";

const apiMock = new ApiMock();

// Shared QueryClient for stories so cache is controlled between runs
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta = {
  title: "Containers/TestsStatistics/StatusGroupDetail",
  component: StatusGroupDetail,
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => {
      queryClient.clear();
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof StatusGroupDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    groupId: TEST_STATUS_GROUPS.PASSED_GROUP.id,
    // map of statusId -> count; include a null key to demonstrate 'Not set' entries
    counts: new Map([
      [DEFAULT_TEST_STATUSES.PASSED.id, 8],
      [DEFAULT_TEST_STATUSES.FAILED.id, 3],
      [null, 2],
    ]),
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatusGroup(
          TEST_STATUS_GROUPS.PASSED_GROUP.id,
          toStatusGroupResponse(TEST_STATUS_GROUPS.PASSED_GROUP)
        ),
        apiMock.readTestStatus(
          DEFAULT_TEST_STATUSES.PASSED.id,
          toStatusResponse(DEFAULT_TEST_STATUSES.PASSED)
        ),
        apiMock.readTestStatus(
          DEFAULT_TEST_STATUSES.FAILED.id,
          toStatusResponse(DEFAULT_TEST_STATUSES.FAILED)
        ),
      ],
    },
  },
};

export const Loading: Story = {
  args: {
    groupId: TEST_STATUS_GROUPS.PASSED_GROUP.id,
    counts: new Map([[DEFAULT_TEST_STATUSES.PASSED.id, 0]]),
  },
  parameters: {
    msw: {
      handlers: [apiMock.readTestStatusGroupInfinite(TEST_STATUS_GROUPS.PASSED_GROUP.id),
      apiMock.readTestStatusInfinite(DEFAULT_TEST_STATUSES.PASSED.id)],
    },
  },
};

export const Error: Story = {
  args: {
    groupId: TEST_STATUS_GROUPS.PASSED_GROUP.id,
    counts: new Map([[DEFAULT_TEST_STATUSES.PASSED.id, 0]]),
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatusGroupCustom(TEST_STATUS_GROUPS.PASSED_GROUP.id, 500, {
          error: "Failed",
        }),
      ],
    },
  },
};

export const NullGroup: Story = {
  args: {
    groupId: null,
    counts: new Map([[null, 4]]),
  },
  parameters: {
    msw: { handlers: [] },
  },
};
