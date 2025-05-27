"use client";

import { tsr } from "@/lib/react-query";
import { type ClientInferResponseBody } from "@ts-rest/core";
import { contract } from "@total-report/core-contract/contract";

export const useFindLaunch = ({
  filter: { id },
  enabled,
}: FindLaunchParams): FindLaunchResponse => {
  const query = tsr.readLaunch.useQuery({
    queryKey: ["launch", id],
    queryData: {
      params: { id: id || 0 },
    },
    enabled: enabled !== false && id !== null && id > 0,
  });

  return {
    // Loading state - when the query is in progress
    isLoading: query.isPending,

    // Error state - when the query has failed
    isError: query.isError,

    // Success state - when the query has completed successfully
    // Only provide data if we have a successful response with status 200
    data: query.data?.status === 200 ? query.data.body : null,
  };
};

export type FindLaunchParams = {
  filter: {
    id: number | null;
  };
  enabled?: boolean;
};

export type FindLaunchResponse = {
  isLoading: boolean;
  isError: boolean;
  data: FindLaunchResponseData | null;
};

export type FindLaunchResponseData = ClientInferResponseBody<
  typeof contract.readLaunch,
  200
>;
