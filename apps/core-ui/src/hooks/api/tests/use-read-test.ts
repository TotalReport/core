import { api } from "@/lib/api-client.js";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useReadTest = ({ testId, enabled }: ReadTestParams) => {
  return api.readTest.useQuery({
    queryKey: ["test", testId],
    queryData: {
      params: {
        id: testId || 0,
      },
    },
    enabled: enabled !== false && testId !== null,
  });
};

export type ReadTestParams = {
  testId: number | null;
  enabled?: boolean;
};

export type ReadTestResponseData = ClientInferResponseBody<
  typeof contract.readTest,
  200
>;
