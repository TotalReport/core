import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindReports = ({
  pagination,
  filters,
  enabled,
}: FindReportsParams): FindReportsResponse => {
  const query = api.findReports.useQuery({
    queryKey: [
      "reports",
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

export type FindReportsParams = {
  filters: {
    titleContains?: string;
  };
  pagination: {
    offset: number;
    limit: number;
  };
  enabled?: boolean;
};

export type ReportEntity = FindReportsResponseData["items"][0];

export type FindReportsResponse = {
  isPending: boolean;
  isError: boolean;
  data: FindReportsResponseData | null;
};

export type FindReportsResponseData = ClientInferResponseBody<
  typeof contract.findReports,
  200
>;
