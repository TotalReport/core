import { api } from "@/lib/api-client.js";

export const useFindStatusGroup = (params: FindStatusGroupParams) => {
  return api.readTestStatusGroup.useQuery({
    queryKey: ["test-status-group", params.filters.id],
    queryData: {
      params: {
        id: params?.filters.id,
      },
    },
    enabled: params?.enabled !== false,
  });
};

export type FindStatusGroupParams = {
  filters: {
    id: string;
  };
  enabled?: boolean;
};
