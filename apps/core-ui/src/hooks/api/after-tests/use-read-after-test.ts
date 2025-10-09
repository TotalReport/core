import { api } from "@/lib/api-client.js";

export const useReadAfterTest = ({
  afterTestId,
  enabled,
}: ReadAfterTestParams) => {
  return api.readAfterTest.useQuery({
    queryKey: ["after-test", afterTestId],
    queryData: {
      params: {
        id: afterTestId || 0,
      },
    },
    enabled: enabled !== false && afterTestId !== null,
  });
};

export type ReadAfterTestParams = {
  afterTestId: number | null;
  enabled?: boolean;
};
