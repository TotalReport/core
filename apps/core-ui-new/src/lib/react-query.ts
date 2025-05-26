import { initTsrReactQuery } from '@ts-rest/react-query/v5';
import { contract } from '@total-report/core-contract/contract';

export const tsr = initTsrReactQuery(contract, {
  baseUrl: process.env.CORE_SERVICE_BASE_URL || 'http://localhost:3030',
  baseHeaders: {
  },
});
