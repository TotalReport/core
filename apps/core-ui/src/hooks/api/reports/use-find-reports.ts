import { api } from "@/lib/api-client.js";
import { ReportsUrlFilters } from "@/types/reports-url-params.js";
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
      filters["title~cnt"],
    ],
    queryData: {
      query: {
        offset: pagination.offset,
        limit: pagination.limit,
        "title~cnt": filters["title~cnt"],
      },
    },
    enabled: enabled !== false,
  });
};

export type FindReportsParams = {
  filters: ReportsUrlFilters;
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
