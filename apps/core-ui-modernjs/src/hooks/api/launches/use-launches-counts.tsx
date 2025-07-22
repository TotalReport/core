import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindLaunchesCount = ({
  filters: { reportId },
  enabled = true,
}: FindLaunchesCountParams): FindLaunchesCountResponse => {
  const query = api.findLaunchesCount.useQuery({
    queryKey: ["launches/count/", reportId],
    queryData: {
      query: {
        reportId: reportId,
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

export type FindLaunchesCountParams = {
  filters: {
    reportId?: number;
  };
  enabled?: boolean;
};

export type FindLaunchesCountResponse = {
  isPending: boolean;
  isError: boolean;
  data: FindLaunchesCountResponseData | null;
};

export type FindLaunchesCountResponseData = ClientInferResponseBody<
  typeof contract.findLaunchesCount,
  200
>;
