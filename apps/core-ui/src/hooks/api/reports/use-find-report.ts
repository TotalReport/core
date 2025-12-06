import { api } from "@/lib/api-client.js";

export const useFindReport = ({
  filters: { id },
  enabled,
}: FindReportParams) => {
  return api.readReport.useQuery({
    queryKey: ["report", id],
    queryData: {
      params: { id },
    },
    enabled: enabled !== false,
  });
};

export type FindReportParams = {
  filters: {
    id: number;
  };
  enabled?: boolean;
};
