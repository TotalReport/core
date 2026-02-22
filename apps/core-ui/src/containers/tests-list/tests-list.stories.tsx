import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ApiMock, FindTestsResponseData } from "@/storybook/mocks/api-mock.js";
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

const sampleTests: FindTestsResponseData = {
  pagination: { total: 3, limit: 10, offset: 0 },
  items: [
    {
      launchId: 1,
      id: 1,
      title: "Test A",
      entityType: "test",
      startedTimestamp: new Date().toISOString(),
      correlationId: "a9351d88-1632-4a7b-890c-df7466d81c30",
      argumentsHash: "b7c7276b-3190-4be5-b0af-21b2850f5693",
      externalArgumentsHash: "2b6b4e2d-ca40-45a3-a3f6-74ef481c7aa0",
    },
    {
      launchId: 1,
      id: 2,
      title: "Test B",
      entityType: "beforeTest",
      startedTimestamp: new Date().toISOString(),
      correlationId: "a9351d88-1632-4a7b-890c-df7466d81c30",
      argumentsHash: "b7c7276b-3190-4be5-b0af-21b2850f5693",
      externalArgumentsHash: "2b6b4e2d-ca40-45a3-a3f6-74ef481c7aa0",
    },
    {
      launchId: 1,
      id: 3,
      title: "Test C",
      entityType: "afterTest",
      startedTimestamp: new Date().toISOString(),
      correlationId: "a9351d88-1632-4a7b-890c-df7466d81c30",
      argumentsHash: "b7c7276b-3190-4be5-b0af-21b2850f5693",
      externalArgumentsHash: "2b6b4e2d-ca40-45a3-a3f6-74ef481c7aa0",
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
      launchId: undefined,
      entityTypes: undefined,
    },
  },
  parameters: {
    msw: {
      handlers: [
        apiMock.findTestEntities(
          { limit: 10, offset: 0, "title~cnt": undefined },
          sampleTests,
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
            filters: { "title~cnt": "no-match", launchId: undefined, entityTypes: undefined },
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
    filters: { "title~cnt": undefined, launchId: undefined, entityTypes: undefined },
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
    filters: { "title~cnt": undefined, launchId: undefined, entityTypes: undefined },
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
