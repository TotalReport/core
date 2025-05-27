"use client";

import { tsr } from "@/lib/react-query";
import { type ClientInferResponseBody } from "@ts-rest/core";
import { contract } from "@total-report/core-contract/contract";

export const useFindLaunches = ({
  pagination,
  filters = {},
  enabled = false,
}: FindLaunchesParams): FindLaunchesResponse => {
  const { offset, limit } = pagination;
  const { reportId, titleContains } = filters;

  const query = tsr.findLaunches.useQuery({
    queryKey: ["launches", offset, limit, reportId, titleContains],
    queryData: {
      query: {
        limit,
        offset,
        reportId: reportId || undefined,
        "title~cnt": titleContains || undefined,
      },
    },
    enabled: enabled !== false,
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

/**
 * Input parameters for the useFindLaunches hook
 */
export type FindLaunchesParams = {
  pagination: {
    offset: number;
    limit: number;
  };
  filters?: {
    reportId?: number;
    titleContains?: string;
  };
  enabled?: boolean;
};

/**
 * Types for the cleaned hook response
 */
export type FindLaunchesResponse = {
  isLoading: boolean;
  isError: boolean;
  data: FindLaunchesResponseData | null;
};

/**
 * Type for the response data
 */
export type FindLaunchesResponseData = ClientInferResponseBody<
  typeof contract.findLaunches,
  200
>;
