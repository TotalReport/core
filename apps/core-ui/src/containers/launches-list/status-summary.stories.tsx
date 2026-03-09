import { toStatusResponse } from "@/storybook/converters/status-response.js";
import { ApiMock } from "@/storybook/mocks/api-mock.js";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DEFAULT_TEST_STATUSES } from "@total-report/core-schema/constants";
import StatusSummary from "./status-summary.jsx";

const apiMock = new ApiMock();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta = {
  title: "Containers/Launches/StatusSummary",
  component: StatusSummary,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Displays status dot and title for a given status ID.",
      },
    },
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
  argTypes: {
    statusId: { control: { type: "text" }, description: "Status ID to fetch" },
    size: { control: { type: "text" }, description: "Tailwind size classes for the dot" },
    className: { control: { type: "text" }, description: "Additional classes" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    size: "w-3 h-3",
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatus(
          DEFAULT_TEST_STATUSES.PASSED.id,
          toStatusResponse(DEFAULT_TEST_STATUSES.PASSED)
        ),
      ],
    },
    docs: { description: { story: "Default status summary for passed status." } },
  },
};

export const Loading: Story = {
  args: { statusId: "status-loading", size: "w-3 h-3" },
  parameters: {
    msw: { handlers: [apiMock.readTestStatusInfinite("status-loading")] },
    docs: { description: { story: "Loading state showing skeleton." } },
  },
};

export const Error: Story = {
  args: { statusId: "PS", size: "w-3 h-3" },
  parameters: {
    msw: {
      handlers: [apiMock.readTestStatusCustom("PS", 404, { error: "Status not found" })],
    },
    docs: { description: { story: "Error state when status cannot be loaded." } },
  },
};

export const NotSet: Story = {
  args: { statusId: null, size: "w-3 h-3" },
  parameters: {
    docs: { description: { story: "Renders fallback when no status ID provided." } },
  },
};
