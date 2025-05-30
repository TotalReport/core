import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { type ClientInferResponseBody } from "@ts-rest/core";

export const useFindTestEntitiesStatusesCounts = ({
  filters,
  enabled = true,
}: FindTestEntitiesStatusesCountsParams): FindTestEntitiesStatusesCountsResponse => {
  const { reportId, launchId, distinct } = filters;
  const query = api.findTestEntitiesCountsByStatuses.useQuery({
    queryKey: ["test-entities/counts/statuses", distinct, reportId, launchId],
    queryData: {
      query: {
        reportId: reportId,
        launchId: launchId,
        distinct,
      },
    },
    enabled: enabled !== false,
  });

  if (query.isPending) {
    return {
      isPending: true,
      isError: false,
      data: null,
    };
  }

  if (query.isError || query.data?.status !== 200) {
    return {
      isPending: false,
      isError: true,
      data: null,
    };
  }

  return {
    isPending: false,
    isError: false,
    data: query.data.body,
  };
};

export type FindTestEntitiesStatusesCountsParams = {
  filters: {
    reportId?: number;
    launchId?: number;
    distinct: boolean;
  };
  enabled?: boolean;
};

export type TestEntityType =
  FindTestEntitiesStatusesCountsResponseData[0]["entityType"];

export type FindTestEntitiesStatusesCountsResponse =
  | {
      isPending: true;
      isError: false;
      data: null;
    }
  | {
      isPending: false;
      isError: true;
      data: null;
    }
  | {
      isPending: false;
      isError: false;
      data: FindTestEntitiesStatusesCountsResponseData;
    };

export type FindTestEntitiesStatusesCountsResponseData =
  ClientInferResponseBody<
    typeof contract.findTestEntitiesCountsByStatuses,
    200
  >;
