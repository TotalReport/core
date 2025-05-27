'use client';

import { tsr } from '@/lib/react-query';

export type LaunchStatisticsParams = {
  filter: {
    id: number | null;
  };
  enabled?: boolean;
};

export const useLaunchStatistics = ({
  filter: { id },
  enabled
}: LaunchStatisticsParams) => {
  return tsr.launchStatistics.useQuery({
    queryKey: ['launch-statistics', id],
    queryData: {
      params: { id: id || 0 },
    },
    enabled: (enabled !== false) && (id !== null && id > 0),
  });
};
