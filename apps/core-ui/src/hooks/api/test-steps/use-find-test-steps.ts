import { api } from "@/lib/api-client.js";

export const useFindTestSteps = (params: FindTestStepsParams) => {
  return api.findTestSteps.useQuery({
    queryKey: ["test-steps", params.filters.testId],
    enabled: params?.enabled !== false,
    queryData: {
      query: {
        testId: params.filters.testId,
      },
    },
  });
};

export type FindTestStepsParams = {
  filters: {
    testId: number;
  };
  enabled?: boolean;
};
