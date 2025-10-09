import { api } from "@/lib/api-client.js";

export const useFindAfterTestSteps = (params: FindAfterTestStepsParams) => {
  return api.findAfterTestSteps.useQuery({
    queryKey: ["after-test-steps", params.filters.afterTestId],
    enabled: params?.enabled !== false,
    queryData: {
      query: {
        afterTestId: params.filters.afterTestId,
      },
    },
  });
};

export type FindAfterTestStepsParams = {
  filters: {
    afterTestId: number;
  };
  enabled?: boolean;
};
