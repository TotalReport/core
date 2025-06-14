import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindStatus = (
  params: FindStatusParams
): FindStatusResponse => {
  const query = api.readTestStatus.useQuery({
    queryKey: ["test-status", params.filters.id],
    enabled: params?.enabled !== false,
    queryData: {
      params: {
        id: params.filters.id,
      },
    },
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

export type FindStatusParams = {
  filters: {
    id: string;
  };
  enabled?: boolean;
};

export type FindStatusResponse =
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
      data: FindStatusResponseData;
    };

export type StatusEntity = FindStatusResponseData;

export type FindStatusResponseData = ClientInferResponseBody<
  typeof contract.readTestStatus,
  200
>;
