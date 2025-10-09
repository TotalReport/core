import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TestDetailsSteps } from "./test-details-steps.jsx";
import { ApiMock } from "@/storybook/mocks/api-mock.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const apiMock = new ApiMock();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, staleTime: 0 },
  },
});

const meta: Meta<typeof TestDetailsSteps> = {
  title: "Containers/TestDetails/Steps",
  component: TestDetailsSteps,
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
};

export default meta;
type Story = StoryObj<typeof TestDetailsSteps>;

const beforeSteps = [
  {
    id: 1,
    title: "Prepare env",
    beforeTestId: 10,
    createdTimestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    startedTimestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    finishedTimestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    isSuccessful: true,
    errorMessage: undefined,
    thread: "main",
    process: "setup",
  },
  {
    id: 4,
    title: "Prepare network",
    beforeTestId: 10,
    createdTimestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    startedTimestamp: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
    finishedTimestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    isSuccessful: false,
    errorMessage: "timeout",
    thread: "net-thread",
    process: "network",
  },
];

const testSteps = [
  {
    id: 2,
    title: "Execute test",
    testId: 10,
    createdTimestamp: new Date(Date.now() - 1000 * 60 * 40).toISOString(),
    startedTimestamp: new Date(Date.now() - 1000 * 60 * 39).toISOString(),
    finishedTimestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    isSuccessful: true,
    errorMessage: undefined,
    thread: "worker-1",
    process: "test-runner",
  },
  {
    id: 5,
    title: "Validate outputs",
    testId: 10,
    createdTimestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
    startedTimestamp: new Date(Date.now() - 1000 * 60 * 33).toISOString(),
    finishedTimestamp: new Date(Date.now() - 1000 * 60 * 32).toISOString(),
    isSuccessful: true,
    errorMessage: undefined,
    thread: "validator",
    process: "assertions",
  },
  {
    id: 6,
    title: "Collect logs",
    testId: 10,
    createdTimestamp: new Date(Date.now() - 1000 * 60 * 31).toISOString(),
    startedTimestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    finishedTimestamp: undefined,
    isSuccessful: false,
    errorMessage: "disk full",
    thread: "io",
    process: "log-collector",
  },
];

const afterSteps = [
  {
    id: 3,
    title: "Cleanup",
    afterTestId: 10,
    createdTimestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    startedTimestamp: new Date(Date.now() - 1000 * 60 * 19).toISOString(),
    finishedTimestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    isSuccessful: true,
    errorMessage: undefined,
    thread: "cleanup-thread",
    process: "teardown",
  },
];

export const Success: Story = {
  args: { testId: 10, testType: "test" },
  parameters: {
    msw: {
      handlers: [
        apiMock.findBeforeTestSteps(10, beforeSteps),
        apiMock.findTestSteps(10, testSteps),
        apiMock.findAfterTestSteps(10, afterSteps),
      ],
    },
  },
};

export const Loading: Story = {
  args: { testId: 10, testType: "test" },
  parameters: {
    msw: {
      handlers: [
        apiMock.findBeforeTestStepsInfinite(10),
        apiMock.findTestStepsInfinite(10),
        apiMock.findAfterTestStepsInfinite(10),
      ],
    },
  },
};

export const Error: Story = {
  args: { testId: 10, testType: "test" },
  parameters: {
    msw: {
      handlers: [
        apiMock.findBeforeTestStepsCustom(10, 500, { error: "boom" }),
        apiMock.findTestStepsCustom(10, 500, { error: "boom" }),
        apiMock.findAfterTestStepsCustom(10, 500, { error: "boom" }),
      ],
    },
  },
};
