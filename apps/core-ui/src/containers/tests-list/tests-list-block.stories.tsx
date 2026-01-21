import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ApiMock } from "@/storybook/mocks/api-mock.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TestsListBlock from "./tests-list-block.jsx";

const apiMock = new ApiMock();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta: Meta<typeof TestsListBlock> = {
  title: "Containers/Tests/TestsListBlock",
  component: TestsListBlock,
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
type Story = StoryObj<typeof TestsListBlock>;

const sampleReports = {
  pagination: { total: 2, limit: 10, offset: 0 },
  items: [
    { id: 1, title: "Report A", createdTimestamp: new Date().toISOString() },
    { id: 2, title: "Report B", createdTimestamp: new Date().toISOString() },
  ],
};

const sampleLaunches = {
  pagination: { total: 2, limit: 10, offset: 0 },
  items: [
    { id: 1, title: "Launch A", reportId: 1, createdTimestamp: new Date().toISOString() },
    { id: 2, title: "Launch B", reportId: 2, createdTimestamp: new Date().toISOString() },
  ],
};

const sampleTests = {
  pagination: { total: 3, limit: 10, offset: 0 },
  items: [
    { id: 1, title: "Test A", entityType: "test", createdTimestamp: new Date().toISOString() },
    { id: 2, title: "Test B", entityType: "beforeTest", createdTimestamp: new Date().toISOString() },
    { id: 3, title: "Test C", entityType: "afterTest", createdTimestamp: new Date().toISOString() },
  ],
};

export const Success: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: null, onSelect: () => {} },
    filters: { "title~cnt": undefined, reportId: undefined, launchId: undefined},
    onFiltersChange: () => {},
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.findReports({ "title~cnt": undefined, limit: 10, offset: 0 }, sampleReports as any),
        apiMock.findLaunches({ "title~cnt": undefined, limit: 10, offset: 0 }, sampleLaunches as any),
        apiMock.findTestEntities({ limit: 10, offset: 0, "title~cnt": undefined }, sampleTests as any),
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: null, onSelect: () => {} },
    filters: { "title~cnt": "no-match", launchId: undefined, reportId: undefined},
    onFiltersChange: () => {},
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.findReports({ "title~cnt": "no-match", limit: 10, offset: 0 }, { pagination: { total: 0, limit: 10, offset: 0 }, items: [] }),
        apiMock.findLaunches({ "title~cnt": "no-match", limit: 10, offset: 0 }, { pagination: { total: 0, limit: 10, offset: 0 }, items: [] }),
        apiMock.findTestEntities({ limit: 10, offset: 0, "title~cnt": "no-match" }, { pagination: { total: 0, limit: 10, offset: 0 }, items: [] }),
      ],
    },
  },
};

export const Loading: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: null, onSelect: () => {} },
        filters: { "title~cnt": undefined, reportId: undefined, launchId: undefined, entityTypes: undefined },
        onFiltersChange: () => {},
  },
  parameters: {
    msw: {
      handlers: [apiMock.findTestEntitiesInfinite({ limit: 10, offset: 0, "title~cnt": undefined })],
    },
  },
};

export const Error: Story = {
  args: {
    pagination: { page: 1, pageSize: 10, setPage: () => {}, setPageSize: () => {} },
    selection: { selectedId: null, onSelect: () => {} },
    filters: { "title~cnt": undefined, reportId: undefined, launchId: undefined, entityTypes: undefined },
    onFiltersChange: () => {},
  },
  parameters: {
    msw: {
      handlers: [apiMock.findTestEntitiesCustom({ limit: 10, offset: 0, "title~cnt": undefined }, 500, { error: "Internal server error" })],
    },
  },
};
