import { api } from "@/lib/api-client.js";

export const useFindStatus = (params: FindStatusParams) => {
  return api.readTestStatus.useQuery({
    queryKey: ["test-status", params.filters.id],
    enabled: params?.enabled !== false,
    queryData: {
      params: {
        id: params.filters.id,
      },
    },
  });
};

export type FindStatusParams = {
  filters: {
    id: string;
  };
  enabled?: boolean;
};
