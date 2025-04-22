import { initTsrReactQuery } from '@ts-rest/react-query/v5';
// import { getAccessToken } from '@some-auth-lib/sdk';
import { contract } from '@total-report/core-contract/contract';

export const tsr = initTsrReactQuery(contract, {
  baseUrl: import.meta.env.PUBLIC_CORE_SERVICE_BASE_URL || 'http://localhost:3030',
  baseHeaders: {
    // 'x-app-source': 'ts-rest',
    // 'x-access-token': () => getAccessToken(),
  },
});