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
import { StatusCount } from "./status-count.jsx";

const apiMock = new ApiMock();

// Shared QueryClient for stories so cache is controlled between runs
const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta = {
  title: "Containers/TestsStatistics/StatusCount",
  component: StatusCount,
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
} satisfies Meta<typeof StatusCount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    count: 12,
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatus(
          DEFAULT_TEST_STATUSES.PASSED.id,
          toStatusResponse(DEFAULT_TEST_STATUSES.PASSED)
        ),
        apiMock.readTestStatusGroup(
          TEST_STATUS_GROUPS.PASSED_GROUP.id,
          toStatusGroupResponse(TEST_STATUS_GROUPS.PASSED_GROUP)
        ),
      ],
    },
  },
};

export const NullStatus: Story = {
  args: {
    statusId: null,
    count: 5,
  },
  parameters: {
    // No status read handler: null indicates 'Not set' and the UI should render the placeholder
    msw: {
      handlers: [],
    },
  },
};

export const Loading: Story = {
  args: {
    statusId: "status-loading",
    count: 0,
  },
  parameters: {
    msw: {
      handlers: [apiMock.readTestStatusInfinite("status-loading")],
    },
  },
};

export const Error: Story = {
  args: {
    statusId: "PS",
    count: 0,
  },
  parameters: {
    msw: {
      handlers: [apiMock.readTestStatusCustom("PS", 500, { error: "Failed" })],
    },
  },
};
