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
import { StatusPill } from "./status-pill.jsx";

const apiMock = new ApiMock();

// Single QueryClient instance for all stories
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
});

const meta = {
  title: "Containers/Status/StatusPill",
  component: StatusPill,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays a color-coded status pill with two segments representing status group and status.",
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
    statusId: {
      control: { type: "text" },
      description: "The ID of the status to display",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
      description: "Size of the status pill",
    },
    className: {
      control: { type: "text" },
      description: "Additional CSS classes",
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Status pill with success status
 */
export const Success: Story = {
  args: {
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    size: "sm",
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
    docs: {
      description: {
        story:
          "Small success status pill with green colors indicating passed test.",
      },
    },
  },
};

/**
 * Status pill in loading state with skeleton
 */
export const Loading: Story = {
  args: {
    statusId: "status-loading",
    size: "md",
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatusInfinite("status-loading"),
        apiMock.readTestStatusGroupInfinite("group-loading"),
      ],
    },
    docs: {
      description: {
        story:
          "Loading state showing skeleton placeholder while status data is being fetched.",
      },
    },
  },
};

/**
 * Status pill with error state
 */
export const StatusError: Story = {
  args: {
    statusId: "PS",
    size: "md",
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatusCustom("PS", 404, { error: "Status not found" }),
      ],
    },
    docs: {
      description: {
        story:
          'Error state when status data cannot be loaded. Shows "Err." with a retry button (↻).',
      },
    },
  },
};

export const StatusGroupError: Story = {
  args: {
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    size: "md",
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatus(
          DEFAULT_TEST_STATUSES.PASSED.id,
          toStatusResponse(DEFAULT_TEST_STATUSES.PASSED)
        ),
        apiMock.readTestStatusGroupCustom(
          TEST_STATUS_GROUPS.PASSED_GROUP.id,
          404,
          { error: "Status not found" }
        ),
      ],
    },
    docs: {
      description: {
        story:
          'Error state when status data cannot be loaded. Shows "Err." with a retry button (↻).',
      },
    },
  },
};

/**
 * Status pill with undefined status ID
 */
export const UndefinedStatus: Story = {
  args: {
    statusId: undefined,
    size: "md",
  },
  parameters: {
    docs: {
      description: {
        story: "Shows undefined status pill with no status ID provided.",
      },
    },
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  args: {
    statusId: "status-1",
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatus("status-1", {
          id: "status-1",
          title: "Passed",
          createdTimestamp: "2024-01-01T10:00:00Z",
          groupId: "group-1",
          color: "#22c55e",
        }),
        apiMock.readTestStatusGroup("group-1", {
          id: "group-1",
          title: "Success",
          createdTimestamp: "2024-01-01T09:00:00Z",
          color: "#16a34a",
        }),
      ],
    },
    docs: {
      description: {
        story: "Comparison of all available sizes side by side.",
      },
    },
  },
  render: (args) => (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <StatusPill {...args} size="sm" />
        <span className="text-xs text-muted-foreground">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <StatusPill {...args} size="md" />
        <span className="text-xs text-muted-foreground">Medium</span>
      </div>
    </div>
  ),
};
