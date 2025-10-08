import { ApiMock } from "@/storybook/mocks/api-mock.js";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DEFAULT_TEST_STATUSES,
  TEST_STATUS_GROUPS,
} from "@total-report/core-schema/constants";
import { TestDetailsStatus } from "./test-details-status.jsx";
import {
  toStatusGroupResponse,
  toStatusResponse,
} from "@/storybook/converters/status-response.js";

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
  title: "Containers/Test Details/TestDetailsStatus",
  component: TestDetailsStatus,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays test status information with status pill and hierarchical status text (group/status). Uses MSW to mock HTTP requests with inline handlers for each story.",
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
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TestDetailsStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Component with successful status loaded
 */
export const Success: Story = {
  args: {
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
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
        story: "Shows a successful test status with green success indicators.",
      },
    },
  },
};

/**
 * Component with undefined status ID
 */
export const UndefinedStatus: Story = {
  args: {
    statusId: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Shows the component when no status ID is provided, displaying "Undefined status".',
      },
    },
  },
};

/**
 * Component in loading state that never resolves
 */
export const Loading: Story = {
  args: {
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatusInfinite(DEFAULT_TEST_STATUSES.PASSED.id),
        apiMock.readTestStatusGroupInfinite(TEST_STATUS_GROUPS.PASSED_GROUP.id),
      ],
    },
    docs: {
      description: {
        story:
          "Shows the endless loading state with requests that never resolve. This simulates a true pending state with loading indicators.",
      },
    },
  },
};

/**
 * Component in error state
 */
export const StatusError: Story = {
  args: {
    statusId: "PS",
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
          "Shows the error state when status data cannot be loaded. Mock returns 404 response.",
      },
    },
  },
};

/**
 * Component with status group error
 */
export const StatusGroupError: Story = {
  args: {
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
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
          { error: "Status group not found" }
        ),
      ],
    },
    docs: {
      description: {
        story:
          "Shows error state when status loads successfully but status group fails to load. Mock returns 200 for status, 404 for group.",
      },
    },
  },
};
