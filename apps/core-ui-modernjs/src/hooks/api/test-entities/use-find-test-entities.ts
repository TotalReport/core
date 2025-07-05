import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindTestEntities = ({
  pagination,
  filters,
  enabled,
}: FindTestEntitiesParams): FindTestEntitiesResponse => {
  const query = api.findTestEntities.useQuery({
    queryKey: [
      "test-entities",
      pagination.offset,
      pagination.limit,
      filters.reportId,
      filters.titleContains,
      filters.launchId,
      filters.entityTypes, // Important: Include all filter params in queryKey to trigger refetch when filters change
    ],
    queryData: {
      query: {
        offset: pagination.offset,
        limit: pagination.limit,
        "title~cnt": filters.titleContains,
        reportId: filters.reportId,
        launchId: filters.launchId,
        entityTypes: filters.entityTypes,
      },
    },
    enabled: enabled !== false,
  });
  return {
    isPending: query.isPending,
    isError: query.isError,
    data: query.data?.status === 200 ? query.data.body : null,
  };
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

export type FindTestEntitiesResponse = {
  isPending: boolean;
  isError: boolean;
  data: FindTestEntitiesResponseData | null;
};

export type FindTestEntitiesResponseData = ClientInferResponseBody<
  typeof contract.findTestEntities,
  200
>;
