import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useReadAfterTest = ({
  afterTestId,
  enabled,
}: ReadAfterTestParams): ReadAfterTestResponse => {
  const query = api.readAfterTest.useQuery({
    queryKey: ["after-test", afterTestId],
    queryData: {
      params: {
        id: afterTestId || 0,
      },
    },
    enabled: enabled !== false && afterTestId !== null,
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

export type ReadAfterTestParams = {
  afterTestId: number | null;
  enabled?: boolean;
};

export type ReadAfterTestResponse =
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
      data: ReadAfterTestResponseData;
    };

export type ReadAfterTestResponseData = ClientInferResponseBody<
  typeof contract.readAfterTest,
  200
>;
