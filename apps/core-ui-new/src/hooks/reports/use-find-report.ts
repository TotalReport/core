import { tsr } from "@/lib/react-query";

export type FindReport = {
  filter: {
    id: number;
  };
  enabled?: boolean;
};

export const useFindReport = ({ filter: { id }, enabled }: FindReport) => {
  return tsr.readReport.useQuery({
    queryKey: ["report", id],
    queryData: {
      params: { id },
    },
    enabled: enabled !== false,
  });
};
