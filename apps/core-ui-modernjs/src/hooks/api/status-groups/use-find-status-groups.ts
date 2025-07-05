import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindStatusGroups = (
  params?: FindStatusGroupsParams
): FindStatusGroupsResponse => {
  const query = api.findTestStatusGroups.useQuery({
    queryKey: ["test-status-groups"],
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

export type FindStatusGroupsParams = {
  enabled?: boolean;
};

export type FindStatusGroupsResponse =
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
      data: FindStatusGroupsResponseData;
    };

export type StatusGroupEntity = FindStatusGroupsResponseData["items"][0];

export type FindStatusGroupsResponseData = ClientInferResponseBody<
  typeof contract.findTestStatusGroups,
  200
>;
