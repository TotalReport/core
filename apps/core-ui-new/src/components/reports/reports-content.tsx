'use client';

import { RestAPIProvider } from '@/components/rest-api/rest-api-provider';
import { ReportsList } from '@/components/reports/reports-list';

export const ReportsContent = () => {
  return (
    <RestAPIProvider>
      <ReportsList />
    </RestAPIProvider>
  );
};
