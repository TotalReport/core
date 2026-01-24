import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { type ClientInferResponseBody } from "@ts-rest/core";

export const useFindTestEntitiesStatusesCounts = ({
  filters,
  enabled = true,
}: FindTestEntitiesStatusesCountsParams) => {
  const { launchId, distinct } = filters;
  return api.findTestEntitiesCountsByStatuses.useQuery({
    queryKey: ["test-entities/counts/statuses", distinct, launchId],
    queryData: {
      query: {
        launchId: launchId,
        distinct,
      },
    },
    enabled: enabled !== false,
  });
};

export type FindTestEntitiesStatusesCountsParams = {
  filters: {
    launchId?: number;
    distinct: boolean;
  };
  enabled?: boolean;
};

export type TestEntityType =
  FindTestEntitiesStatusesCountsResponseData[0]["entityType"];

export type FindTestEntitiesStatusesCountsResponseData =
  ClientInferResponseBody<
    typeof contract.findTestEntitiesCountsByStatuses,
    200
  >;
