import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useReadBeforeTest = ({
  beforeTestId,
  enabled,
}: ReadBeforeTestParams): ReadBeforeTestResponse => {
  const query = api.readBeforeTest.useQuery({
    queryKey: ["before-test", beforeTestId],
    queryData: {
      params: {
        id: beforeTestId || 0,
      },
    },
    enabled: enabled !== false && beforeTestId !== null,
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

export type ReadBeforeTestParams = {
  beforeTestId: number | null;
  enabled?: boolean;
};

export type ReadBeforeTestResponse =
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
      data: ReadBeforeTestResponseData;
    };

export type ReadBeforeTestResponseData = ClientInferResponseBody<
  typeof contract.readBeforeTest,
  200
>;
