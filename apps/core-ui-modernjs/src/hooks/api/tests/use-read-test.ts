import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useReadTest = ({
  testId,
  enabled,
}: ReadTestParams): ReadTestResponse => {
  const query = api.readTest.useQuery({
    queryKey: ["test", testId],
    queryData: {
      params: {
        id: testId || 0,
      },
    },
    enabled: enabled !== false && testId !== null,
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

export type ReadTestParams = {
  testId: number | null;
  enabled?: boolean;
};

export type ReadTestResponse =
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
      data: ReadTestResponseData;
    };

export type ReadTestResponseData = ClientInferResponseBody<
  typeof contract.readTest,
  200
>;
