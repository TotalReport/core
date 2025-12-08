import React from 'react';
import { RestAPIProvider } from '@/components/providers/rest-api-provider.jsx';
import { TestsList } from '@/components/tests/tests-list.jsx';

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
      <TestsList />
    </div>
  );
};