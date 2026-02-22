import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ApiMock, FindLaunchesResponse } from "@/storybook/mocks/api-mock.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LaunchesListBlock } from "./launches-list-block.jsx";

const apiMock = new ApiMock();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta: Meta<typeof LaunchesListBlock> = {
  title: "Containers/Launches/LaunchesListBlock",
  component: LaunchesListBlock,
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
type Story = StoryObj<typeof LaunchesListBlock>;

const sampleLaunches: FindLaunchesResponse = {
  pagination: { total: 3, limit: 10, offset: 0 },
  items: [
    { id: 1, title: "Launch A", startedTimestamp: new Date().toISOString() },
    { id: 2, title: "Launch B", startedTimestamp: new Date().toISOString() },
    { id: 3, title: "Launch C", startedTimestamp: new Date().toISOString() },
  ],
};

export const Success: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: null, onSelect: () => {} },
    filters: { "title~cnt": undefined },
    onFiltersChange: () => {},
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.findLaunches({ "title~cnt": undefined, limit: 10, offset: 0 }, sampleLaunches),
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: null, onSelect: () => {} },
    filters: { "title~cnt": "no-match" },
    onFiltersChange: () => {},
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.findLaunches({ "title~cnt": "no-match", limit: 10, offset: 0 }, { pagination: { total: 0, limit: 10, offset: 0 }, items: [] }),
      ],
    },
  },
};

export const Loading: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: null, onSelect: () => {} },
    filters: { "title~cnt": undefined },
    onFiltersChange: () => {},
  },
  parameters: {
    msw: {
      handlers: [apiMock.findLaunchesInfinite({ "title~cnt": undefined, limit: 10, offset: 0 })],
    },
  },
};

export const Error: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: null, onSelect: () => {} },
    filters: { "title~cnt": undefined },
    onFiltersChange: () => {},
  },
  parameters: {
    msw: {
      handlers: [apiMock.findLaunchesCustom({ "title~cnt": undefined, limit: 10, offset: 0 }, 500, { error: "Internal server error" })],
    },
  },
};
