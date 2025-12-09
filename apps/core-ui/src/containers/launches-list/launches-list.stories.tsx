import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import LaunchesList from "./launches-list.jsx";
import { ApiMock } from "@/storybook/mocks/api-mock.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const apiMock = new ApiMock();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta: Meta<typeof LaunchesList> = {
  title: "Containers/Launches/LaunchesList",
  component: LaunchesList,
  decorators: [
    (Story) => {
      queryClient.clear();
      return (
        <QueryClientProvider client={queryClient}>
          <div style={{ width: 400, height: 600 }}>
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof LaunchesList>;

const sampleLaunches = {
  pagination: { total: 3, limit: 10, offset: 0 },
  items: [
    { id: 1, reportId: 1, title: "Launch A", createdTimestamp: new Date().toISOString() },
    { id: 2, reportId: 1, title: "Launch B", createdTimestamp: new Date().toISOString() },
    { id: 3, reportId: 1, title: "Launch C", createdTimestamp: new Date().toISOString() },
  ],
};

export const Success: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: undefined, onSelect: () => {} },
    filters: { reportId: 1 },
  },
  parameters: {
    msw: {
      handlers: [apiMock.findLaunches({ reportId: 1, limit: 10, offset: 0 }, sampleLaunches as any)],
    },
  },
};

export const Empty: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: undefined, onSelect: () => {} },
    filters: { reportId: 2 },
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.findLaunches(
          { reportId: 2, limit: 10, offset: 0 },
          { pagination: { total: 0, limit: 10, offset: 0 }, items: [] }
        ),
      ],
    },
  },
};

export const Loading: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: undefined, onSelect: () => {} },
    filters: { reportId: 1 },
  },
  parameters: {
    msw: {
      handlers: [apiMock.findLaunchesInfinite({ reportId: 1, limit: 10, offset: 0 })],
    },
  },
};

export const Error: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: undefined, onSelect: () => {} },
    filters: { reportId: 1 },
  },
  parameters: {
    msw: {
      handlers: [apiMock.findLaunchesCustom({ reportId: 1, limit: 10, offset: 0 }, 500, { error: "Internal server error" })],
    },
  },
};
