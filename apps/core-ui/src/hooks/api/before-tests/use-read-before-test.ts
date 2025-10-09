import { api } from "@/lib/api-client.js";

export const useReadBeforeTest = ({
  beforeTestId,
  enabled,
}: ReadBeforeTestParams) => {
  return api.readBeforeTest.useQuery({
    queryKey: ["before-test", beforeTestId],
    queryData: {
      params: {
        id: beforeTestId || 0,
      },
    },
    enabled: enabled !== false && beforeTestId !== null,
  });
};

export type ReadBeforeTestParams = {
  beforeTestId: number | null;
  enabled?: boolean;
};
