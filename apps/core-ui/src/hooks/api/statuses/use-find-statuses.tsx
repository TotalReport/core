import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindStatuses = (
  params?: FindStatusesParams
): FindStatusesResponse => {
  const query = api.findTestStatuses.useQuery({
    queryKey: ["test-statuses"],
    enabled: params?.enabled !== false,
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

export type FindStatusesParams = {
  enabled?: boolean;
};

export type FindStatusesResponse =
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
      data: FindStatusesResponseData;
    };

export type StatusEntity = FindStatusesResponseData["items"][0];

export type FindStatusesResponseData = ClientInferResponseBody<
  typeof contract.findTestStatuses,
  200
>;
