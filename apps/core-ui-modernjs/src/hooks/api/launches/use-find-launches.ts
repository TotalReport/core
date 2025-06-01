import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindLaunches = ({
  pagination,
  filters,
  enabled,
}: FindLaunchesParams): FindLaunchesResponse => {
  const query = api.findLaunches.useQuery({
    queryKey: [
      "launches",
      pagination.offset,
      pagination.limit,
      filters.titleContains,
    ],
    queryData: {
      query: {
        offset: pagination.offset,
        limit: pagination.limit,
        "title~cnt": filters.titleContains,
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

export type FindLaunchesParams = {
  filters: {
    titleContains?: string;
  };
  pagination: {
    offset: number;
    limit: number;
  };
  enabled?: boolean;
};

export type LaunchEntity = FindLaunchesResponseData["items"][0];

export type FindLaunchesResponse = {
  isPending: boolean;
  isError: boolean;
  data: FindLaunchesResponseData | null;
};

export type FindLaunchesResponseData = ClientInferResponseBody<
  typeof contract.findLaunches,
  200
>;
