import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ApiMock } from "@/storybook/mocks/api-mock.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TestsList } from "./tests-list.jsx";

const apiMock = new ApiMock();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

const meta: Meta<typeof TestsList> = {
  title: "Containers/Tests/TestsList",
  component: TestsList,
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
type Story = StoryObj<typeof TestsList>;

const sampleTests = {
  pagination: { total: 3, limit: 10, offset: 0 },
  items: [
    {
      id: 1,
      title: "Test A",
      entityType: "test",
      createdTimestamp: new Date().toISOString(),
    },
    {
      id: 2,
      title: "Test B",
      entityType: "beforeTest",
      createdTimestamp: new Date().toISOString(),
    },
    {
      id: 3,
      title: "Test C",
      entityType: "afterTest",
      createdTimestamp: new Date().toISOString(),
    },
  ],
};

export const Success: Story = {
  args: {
    pagination: {
      page: 1,
      pageSize: 10,
      setPage: () => {},
      setPageSize: () => {},
    },
    selection: { selectedId: undefined, onSelect: () => {} },
    filters: {
      "title~cnt": undefined,
      reportId: undefined,
      launchId: undefined,
      entityTypes: undefined,
    },
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.findTestEntities(
          { limit: 10, offset: 0, "title~cnt": undefined },
          sampleTests as any,
        ),
      ],
    },
  },
};

export const Empty: Story = {
  args: {
    pagination: {
      page: 1,
      pageSize: 10,
      setPage: () => {},
      setPageSize: () => {},
    },
    selection: { selectedId: undefined, onSelect: () => {} },
            filters: { "title~cnt": "no-match", reportId: undefined, launchId: undefined, entityTypes: undefined },
        },
  parameters: {
    msw: {
      handlers: [
        apiMock.findTestEntities(
          { limit: 10, offset: 0, "title~cnt": "no-match" },
          { pagination: { total: 0, limit: 10, offset: 0 }, items: [] },
        ),
      ],
    },
  },
};

export const Loading: Story = {
  args: {
    pagination: {
      page: 1,
      pageSize: 10,
      setPage: () => {},
      setPageSize: () => {},
    },
    selection: { selectedId: undefined, onSelect: () => {} },
    filters: { "title~cnt": undefined, reportId: undefined, launchId: undefined, entityTypes: undefined },
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.findTestEntitiesInfinite({
          limit: 10,
          offset: 0,
          "title~cnt": undefined,
        }),
      ],
    },
  },
};

export const Error: Story = {
  args: {
    pagination: {
      page: 1,
      pageSize: 10,
      setPage: () => {},
      setPageSize: () => {},
    },
    selection: { selectedId: undefined, onSelect: () => {} },
    filters: { "title~cnt": undefined, reportId: undefined, launchId: undefined, entityTypes: undefined },
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.findTestEntitiesCustom(
          { limit: 10, offset: 0, "title~cnt": undefined },
          500,
          { error: "Internal server error" },
        ),
      ],
    },
  },
};
