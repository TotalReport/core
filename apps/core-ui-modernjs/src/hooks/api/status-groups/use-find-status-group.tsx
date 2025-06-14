import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindStatusGroup = (
  params: FindStatusGroupParams
): FindStatusGroupResponse => {
  const query = api.readTestStatusGroup.useQuery({
    queryKey: ["test-status-group", params.filters.id],
    queryData: {
      params: {
        id: params?.filters.id,
      },
    },
    enabled: params?.enabled !== false,
  });

  if (!params.enabled) {
    return {
      isEnabled: false,
      isPending: false,
      isError: false,
      data: null,
    };
  }

  if (query.isPending) {
    return {
      isEnabled: true,
      isPending: true,
      isError: false,
      data: null,
    };
  }

  if (query.isError || query.data?.status !== 200) {
    return {
      isEnabled: true,
      isPending: false,
      isError: true,
      data: null,
    };
  }

  return {
    isEnabled: true,
    isPending: false,
    isError: false,
    data: query.data.body,
  };
};

export type FindStatusGroupParams = {
  filters: {
    id: string;
  };
  enabled?: boolean;
};

export type FindStatusGroupResponse =
  | {
      isEnabled: false;
      isPending: false;
      isError: false;
      data: null;
    }
  | {
      isEnabled: true;
      isPending: true;
      isError: false;
      data: null;
    }
  | {
      isEnabled: true;
      isPending: false;
      isError: true;
      data: null;
    }
  | {
      isEnabled: true;
      isPending: false;
      isError: false;
      data: FindStatusGroupResponseData;
    };

export type StatusEntity = FindStatusGroupResponseData;

export type FindStatusGroupResponseData = ClientInferResponseBody<
  typeof contract.readTestStatusGroup,
  200
>;
