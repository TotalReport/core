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
      refetch: () => query.refetch(),
    };
  }

  if (query.isError || query.data?.status !== 200) {
    return {
      isPending: false,
      isError: true,
      data: null,
      refetch: () => query.refetch(),
    };
  }

  return {
    isPending: false,
    isError: false,
    data: query.data.body,
    refetch: () => query.refetch(),
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
      refetch: () => void;
    }
  | {
      isPending: false;
      isError: true;
      data: null;
      refetch: () => void;
    }
  | {
      isPending: false;
      isError: false;
      data: FindStatusesResponseData;
      refetch: () => void;
    };

export type StatusEntity = FindStatusesResponseData["items"][0];

export type FindStatusesResponseData = ClientInferResponseBody<
  typeof contract.findTestStatuses,
  200
>;
