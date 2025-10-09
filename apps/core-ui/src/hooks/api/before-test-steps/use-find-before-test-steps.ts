import { api } from "@/lib/api-client.js";

export const useFindBeforeTestSteps = (params: FindBeforeTestStepsParams) => {
  return api.findBeforeTestSteps.useQuery({
    queryKey: ["before-test-steps", params.filters.beforeTestId],
    enabled: params?.enabled !== false,
    queryData: {
      query: {
        beforeTestId: params.filters.beforeTestId,
      },
    },
  });
};

export type FindBeforeTestStepsParams = {
  filters: {
    beforeTestId: number;
  };
  enabled?: boolean;
};
