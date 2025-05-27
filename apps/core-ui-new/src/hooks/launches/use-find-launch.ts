'use client';

import { tsr } from '@/lib/react-query';

export type FindLaunch = {
  filter: {
    id: number | null;
  };
  enabled?: boolean;
};

export const useFindLaunch = ({ 
  filter: { id }, 
  enabled 
}: FindLaunch) => {
  return tsr.readLaunch.useQuery({
    queryKey: ['launch', id],
    queryData: {
      params: { id: id || 0 },
    },
    enabled: (enabled !== false) && (id !== null && id > 0),
  });
};
