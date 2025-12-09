import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindReports = ({
  pagination,
  filters,
  enabled,
}: FindReportsParams) => {
  return api.findReports.useQuery({
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

export type FindReportsResponseData = ClientInferResponseBody<
  typeof contract.findReports,
  200
>;
