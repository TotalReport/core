import { api } from "@/lib/api-client.js";

export const useFindLaunch = ({
  filters: { id },
  enabled,
}: FindLaunchParams) => {
  return api.readLaunch.useQuery({
    queryKey: ["launch", id],
    queryData: {
      params: { id },
    },
    enabled: enabled !== false,
  });
};

export type FindLaunchParams = {
  filters: {
    id: number;
  };
  enabled?: boolean;
};
