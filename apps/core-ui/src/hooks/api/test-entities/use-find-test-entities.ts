import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindTestEntities = ({
  pagination,
  filters,
  enabled,
}: FindTestEntitiesParams) => {
  return api.findTestEntities.useQuery({
    queryKey: [
      "test-entities",
      pagination.offset,
      pagination.limit,
      filters.reportId,
      filters.launchId,
      filters.entityTypes,
      filters.titleContains,
    ],
    queryData: {
      query: {
        offset: pagination.offset,
        limit: pagination.limit,
        reportId: filters.reportId,
        launchId: filters.launchId,
        entityTypes: filters.entityTypes,
        "title~cnt": filters.titleContains,
      },
    },
    enabled: enabled !== false,
  });
};

export type FindTestEntitiesParams = {
  filters: {
    titleContains?: string;
    reportId?: number;
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
  typeof contract.findTestEntities,
  200
>;
