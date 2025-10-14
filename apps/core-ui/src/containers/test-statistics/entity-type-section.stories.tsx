import { ApiMock } from "@/storybook/mocks/api-mock.js";
import {
  toStatusGroupResponse,
  toStatusResponse,
} from "@/storybook/converters/status-response.js";
import type { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  DEFAULT_TEST_STATUSES,
  TEST_STATUS_GROUPS,
} from "@total-report/core-schema/constants";
import { EntityTypeSection } from "./entity-type-section.jsx";

const apiMock = new ApiMock();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta: Meta<typeof EntityTypeSection> = {
  title: "Containers/TestsStatistics/EntityTypeSection",
  component: EntityTypeSection,
  decorators: [
    (Story) => {
      queryClient.clear();
      return (
        <QueryClientProvider client={queryClient}>
          <div style={{ width: 540 }}>
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to build counts map: groupId -> (statusId -> count)
function makeCounts() {
  return new Map([
    [
      TEST_STATUS_GROUPS.PASSED_GROUP.id,
      new Map([
        [DEFAULT_TEST_STATUSES.PASSED.id, 8],
        [DEFAULT_TEST_STATUSES.FAILED.id, 2],
      ]),
    ],
    [
      TEST_STATUS_GROUPS.FAILED_GROUP.id,
      new Map([[DEFAULT_TEST_STATUSES.FAILED.id, 5]]),
    ],
  ]);
}

export const Success: Story = {
  args: {
    entityType: "test",
    counts: makeCounts(),
  },
  parameters: {
    msw: {
      handlers: [
        // provide group and status reads used by StatusGroupSummary/Detail
        apiMock.readTestStatusGroup(
          TEST_STATUS_GROUPS.PASSED_GROUP.id,
          toStatusGroupResponse(TEST_STATUS_GROUPS.PASSED_GROUP)
        ),
        apiMock.readTestStatusGroup(
          TEST_STATUS_GROUPS.FAILED_GROUP.id,
          toStatusGroupResponse(TEST_STATUS_GROUPS.FAILED_GROUP)
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
    entityType: "test",
    counts: makeCounts(),
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatusGroupInfinite(TEST_STATUS_GROUPS.PASSED_GROUP.id),
        apiMock.readTestStatusGroupInfinite(TEST_STATUS_GROUPS.FAILED_GROUP.id),
        apiMock.readTestStatusGroupInfinite(TEST_STATUS_GROUPS.SKIPPED_GROUP.id),
        apiMock.readTestStatusInfinite(DEFAULT_TEST_STATUSES.PASSED.id),
        apiMock.readTestStatusInfinite(DEFAULT_TEST_STATUSES.FAILED.id),
        apiMock.readTestStatusInfinite(DEFAULT_TEST_STATUSES.SKIPPED.id),
      ],
    },
  },
};

export const Error: Story = {
  args: {
    entityType: "test",
    counts: makeCounts(),
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.readTestStatusGroupCustom(TEST_STATUS_GROUPS.PASSED_GROUP.id, 500, {
          error: "server",
        }),
        apiMock.readTestStatusGroupCustom(TEST_STATUS_GROUPS.FAILED_GROUP.id, 500, {
          error: "server",
        }),
        apiMock.readTestStatusCustom(DEFAULT_TEST_STATUSES.PASSED.id, 500, {
          error: "server",
        }),
        apiMock.readTestStatusCustom(DEFAULT_TEST_STATUSES.FAILED.id, 500, {
          error: "server",
        }),
        apiMock.readTestStatusCustom(DEFAULT_TEST_STATUSES.SKIPPED.id, 500, {
          error: "server",
        }),
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    entityType: "test",
    counts: new Map(),
  },
  parameters: {
    msw: { handlers: [] },
  },
};
