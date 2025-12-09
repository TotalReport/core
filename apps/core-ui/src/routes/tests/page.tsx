import React from 'react';
import { RestAPIProvider } from '@/components/providers/rest-api-provider.jsx';
import { TestsListBlock } from '@/components/tests/tests-list.jsx';

export const title = "Tests - Total Report";

export default function TestsPage() {
  return (
    <RestAPIProvider>
      <TestsPageContent />
    </RestAPIProvider>
  );
}

const TestsPageContent = () => {
  return (
    <div className="flex h-screen">
      <TestsListBlock />
    </div>
  );
};