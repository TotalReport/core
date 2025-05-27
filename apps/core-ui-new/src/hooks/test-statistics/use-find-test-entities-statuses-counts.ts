"use client";

import { tsr } from "@/lib/react-query";
import { contract } from "@total-report/core-contract/contract";
import { type ClientInferResponseBody } from "@ts-rest/core";

export const useFindTestEntitiesStatusesCounts = ({
  filters,
  enabled = true,
}: FindTestEntitiesStatusesCountsParams): FindTestEntitiesStatusesCountsResponse => {
  const { reportId, distinct } = filters;
  const query = tsr.findTestEntitiesCountsByStatuses.useQuery({
    queryKey: ["test-entities/counts/statuses", distinct, reportId],
    queryData: {
      query: {
        reportId: reportId || 0,
        distinct,
      },
    },
    enabled:
      enabled && reportId !== undefined && reportId !== null && reportId > 0,
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
 * Input parameters for the useFindTestEntitiesStatusesCounts hook
 */
export type FindTestEntitiesStatusesCountsParams = {
  filters: {
    reportId?: number | null;
    distinct: boolean;
  };
  enabled?: boolean;
};

/**
 * Types for the cleaned hook response
 */
export type FindTestEntitiesStatusesCountsResponse = {
  isLoading: boolean;
  isError: boolean;
  data: FindTestEntitiesStatusesCountsResponseData | null;
};

/**
 * Type for the response data
 */
export type FindTestEntitiesStatusesCountsResponseData =
  ClientInferResponseBody<
    typeof contract.findTestEntitiesCountsByStatuses,
    200
  >;
