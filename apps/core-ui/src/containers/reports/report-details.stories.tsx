import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ReportDetails } from "./report-details.jsx";
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

const meta: Meta<typeof ReportDetails> = {
  title: "Containers/Reports/ReportDetails",
  component: ReportDetails,
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
type Story = StoryObj<typeof ReportDetails>;

const exampleReport = {
  id: 42,
  title: "Example Report",
  createdTimestamp: new Date("2025-01-15T10:00:00Z").toISOString(),
};

// Sample statistics data for the report — matches the shape expected by the
// TestsStatistics container and the API contract `findTestEntitiesCountsByStatuses`.
const reportTestEntitiesCounts: TestEntitiesCountsByStatusesResponse = [
  {
    entityType: "test",
    statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    count: 45,
  },
  {
    entityType: "test",
    statusGroupId: DEFAULT_TEST_STATUSES.FAILED.groupId,
    statusId: DEFAULT_TEST_STATUSES.FAILED.id,
    count: 3,
  },
  {
    entityType: "test",
    statusGroupId: DEFAULT_TEST_STATUSES.SKIPPED.groupId,
    statusId: DEFAULT_TEST_STATUSES.SKIPPED.id,
    count: 2,
  },
  {
    entityType: "beforeTest",
    statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    count: 5,
  },
  {
    entityType: "afterTest",
    statusGroupId: DEFAULT_TEST_STATUSES.PASSED.groupId,
    statusId: DEFAULT_TEST_STATUSES.PASSED.id,
    count: 5,
  },
];

export const Success: Story = {
  args: { reportId: 42 },
  parameters: {
    msw: {
      handlers: [
        apiMock.readReport(42, exampleReport),
        apiMock.findLaunchesCount({ reportId: 42 }, { count: 12 }),
        apiMock.findTestEntitiesCountsByStatuses(
          { distinct: true, reportId: 42 },
          reportTestEntitiesCounts
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
        apiMock.readTestStatus(
          DEFAULT_TEST_STATUSES.SKIPPED.id,
          toStatusResponse(DEFAULT_TEST_STATUSES.SKIPPED)
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
        apiMock.readTestStatusGroup(
          TEST_STATUS_GROUPS.SKIPPED_GROUP.id,
          toStatusGroupResponse(TEST_STATUS_GROUPS.SKIPPED_GROUP)
        ),
      ],
    },
  },
};

export const Loading: Story = {
  args: { reportId: 42 },
  parameters: {
    msw: {
      handlers: [apiMock.readReportInfinite(42)],
    },
  },
};

export const Error: Story = {
  args: { reportId: 42 },
  parameters: {
    msw: {
      handlers: [apiMock.readReportCustom(42, 500, { error: "Internal server error" })],
    },
  },
};
