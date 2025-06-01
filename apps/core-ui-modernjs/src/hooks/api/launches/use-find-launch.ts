import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindReport = ({
  filters: { id },
  enabled,
}: FindLaunchParams): FindLaunchResponse => {
  const query = api.readLaunch.useQuery({
    queryKey: ["launch", id],
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

export type FindLaunchParams = {
  filters: {
    id: number;
  };
  enabled?: boolean;
};

export type FindLaunchResponse =
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
      data: FindLaunchResponseData;
    };

export type LaunchEntity = FindLaunchResponseData;

export type FindLaunchResponseData = ClientInferResponseBody<
  typeof contract.readLaunch,
  200
>;
