'use client';

import { tsr } from '@/lib/react-query';

export type FindLaunches = {
  offset: number;
  limit: number;
  reportId?: number;
};

export const useFindLaunches = ({
  offset,
  limit,
  reportId,
}: FindLaunches) => {
  return tsr.findLaunches.useQuery({
    queryKey: ['launches', offset, limit, reportId],
    queryData: {
      query: {
        limit,
        offset,
        reportId: reportId || undefined,
      },
    },
  });
};
