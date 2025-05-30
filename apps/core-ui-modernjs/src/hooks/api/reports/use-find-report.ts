import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindReport = ({
  filters: { id },
  enabled,
}: FindReportParams): FindReportResponse => {
  const query = api.readReport.useQuery({
    queryKey: ["report", id],
    queryData: {
      params: { id },
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

export type FindReportParams = {
  filters: {
    id: number;
  };
  enabled?: boolean;
};

export type FindReportResponse =
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
      data: FindReportResponseData;
    };

export type ReportEntity = FindReportResponseData;

export type FindReportResponseData = ClientInferResponseBody<
  typeof contract.readReport,
  200
>;
