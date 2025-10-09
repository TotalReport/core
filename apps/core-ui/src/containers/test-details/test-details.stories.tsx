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
import { TestDetails } from "./test-details.jsx";

const apiMock = new ApiMock();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta: Meta<typeof TestDetails> = {
  title: "Containers/TestDetails/Detail",
  component: TestDetails,
  decorators: [
    (Story) => {
      queryClient.clear();
      return (
        <QueryClientProvider client={queryClient}>
          <div style={{ width: 680 }}>
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
type Story = StoryObj<typeof TestDetails>;

const testEntity = {
  id: 10,
  title: "Example test",
  statusId: DEFAULT_TEST_STATUSES.PASSED.id,
  createdTimestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  startedTimestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
  finishedTimestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
  correlationId: "1a5b1bb0-6e35-43f4-8328-cd4188552949",
  argumentsHash: "83d4ecc7-44f3-49bb-89df-875b1e5193c2",
  launchId: 1,
  externalArgumentsHash: "3b839ba7-f454-483c-ad98-7ac1570cbdaa",
  arguments: [{ id: 1, name: "arg1", type: "string", value: "value1" }],
};

// Entities for before/after tests require additional fields (launchId, externalArgumentsHash)
const beforeEntity = {
  ...testEntity,
  launchId: 1,
  externalArgumentsHash: "ext-abc",
};

const afterEntity = {
  ...testEntity,
  launchId: 1,
  externalArgumentsHash: "ext-xyz",
};

export const Success: Story = {
  args: { entityType: "test", entityId: 10 },
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
        apiMock.readTest(10, testEntity),
        apiMock.readBeforeTest(10, beforeEntity),
        apiMock.readAfterTest(10, afterEntity),
      ],
    },
    docs: {
      description: {
        story: "Displays test details when the API returns the test entity.",
      },
    },
  },
};

export const Loading: Story = {
  args: { entityType: "test", entityId: 10 },
  parameters: {
    msw: {
      handlers: [apiMock.readTestInfinite(10)],
    },
    docs: {
      description: { story: "Shows skeleton while test is being fetched." },
    },
  },
};

export const Error: Story = {
  args: { entityType: "test", entityId: 10 },
  parameters: {
    msw: {
      handlers: [apiMock.readTestCustom(10, 500, { error: "server error" })],
    },
    docs: { description: { story: "Error state when test cannot be loaded." } },
  },
};
