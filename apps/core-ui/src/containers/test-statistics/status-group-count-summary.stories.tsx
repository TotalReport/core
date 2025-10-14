import {
  toStatusGroupResponse,
} from "@/storybook/converters/status-response.js";
import { ApiMock } from "@/storybook/mocks/api-mock.js";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TEST_STATUS_GROUPS } from "@total-report/core-schema/constants";
import { StatusGroupCountSummary } from "./status-group-count-summary.jsx";

const apiMock = new ApiMock();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta = {
  title: "Containers/TestsStatistics/StatusGroupCountSummary",
  component: StatusGroupCountSummary,
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
} satisfies Meta<typeof StatusGroupCountSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    groupId: TEST_STATUS_GROUPS.PASSED_GROUP.id,
    count: 12,
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatusGroup(
          TEST_STATUS_GROUPS.PASSED_GROUP.id,
          toStatusGroupResponse(TEST_STATUS_GROUPS.PASSED_GROUP)
        ),
      ],
    },
  },
};

export const NullGroup: Story = {
  args: {
    groupId: null,
    count: 5,
  },
  parameters: {
    msw: { handlers: [] },
  },
};

export const Loading: Story = {
  args: {
    groupId: TEST_STATUS_GROUPS.PASSED_GROUP.id,
    count: 3,
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatusGroupInfinite(TEST_STATUS_GROUPS.PASSED_GROUP.id),
      ],
    },
  },
};

export const Error: Story = {
  args: {
    groupId: TEST_STATUS_GROUPS.PASSED_GROUP.id,
    count: 0,
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
