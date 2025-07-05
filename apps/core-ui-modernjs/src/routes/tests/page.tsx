import React from 'react';
import { RestAPIProvider } from '@/components/providers/rest-api-provider.jsx';
import { TestsContainer } from '@/containers/tests/tests-container.jsx';

export const title = "Tests - Total Report";

export default function Tests() {
  return (
    <RestAPIProvider>
      <TestsContainer />
    </RestAPIProvider>
  );
}
