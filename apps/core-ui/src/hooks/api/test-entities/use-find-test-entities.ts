import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindTestEntities = ({
  pagination,
  filters,
  enabled,
}: FindTestEntitiesParams) => {
  return api.findTests.useQuery({
    queryKey: [
      "test-entities",
      pagination.offset,
      pagination.limit,
      filters.launchId,
      filters.entityTypes,
      filters["title~cnt"],
    ],
    queryData: {
      query: {
        offset: pagination.offset,
        limit: pagination.limit,
        launchId: filters.launchId,
        entityTypes: filters.entityTypes,
        "title~cnt": filters["title~cnt"],
      },
    },
    enabled: enabled !== false,
  });
};

export type FindTestEntitiesParams = {
  filters: {
    "title~cnt"?: string;
    launchId?: number;
    entityTypes?: ("beforeTest" | "test" | "afterTest")[]; // Add entity types filter with proper typing
  };
  pagination: {
    offset: number;
    limit: number;
  };
  enabled?: boolean;
};

export type TestEntity = FindTestEntitiesResponseData["items"][0];

export type FindTestEntitiesResponseData = ClientInferResponseBody<
  typeof contract.findTests,
  200
>;
