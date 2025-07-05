import { SelectedTest } from '@/hooks/use-tests-list.js';
import { useReadTest } from '@/hooks/api/tests/use-read-test.js';
import { useReadBeforeTest } from '@/hooks/api/before-tests/use-read-before-test.js';
import { useReadAfterTest } from '@/hooks/api/after-tests/use-read-after-test.js';
import { useFindStatuses } from '@/hooks/api/statuses/use-find-statuses.jsx';
import { useFindStatusGroups } from '@/hooks/api/status-groups/use-find-status-groups.js';
import { formatTestDetails } from '@/lib/test-utils.js';
import { TestDetails } from './test-details.jsx';

type TestDetailsContainerProps = {
  selectedTest: SelectedTest | null;
};

export const TestDetailsContainer = ({ selectedTest }: TestDetailsContainerProps) => {
  // Fetch test data based on selected test type
  const testQuery = useReadTest({
    testId: selectedTest?.type === 'test' ? selectedTest.id : null,
  });

  const beforeTestQuery = useReadBeforeTest({
    beforeTestId: selectedTest?.type === 'before-test' ? selectedTest.id : null,
  });

  const afterTestQuery = useReadAfterTest({
    afterTestId: selectedTest?.type === 'after-test' ? selectedTest.id : null,
  });

  // Fetch statuses and status groups for formatting
  const statusesQuery = useFindStatuses();
  const statusGroupsQuery = useFindStatusGroups();

  // Determine current query and data
  const getCurrentQuery = () => {
    switch (selectedTest?.type) {
      case 'test':
        return testQuery;
      case 'before-test':
        return beforeTestQuery;
      case 'after-test':
        return afterTestQuery;
      default:
        return null;
    }
  };

  const currentQuery = getCurrentQuery();

  // Show loading state
  if (
    currentQuery?.isPending ||
    statusesQuery.isPending ||
    statusGroupsQuery.isPending
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg font-bold text-secondary-foreground">
            Loading test details...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (
    currentQuery?.isError ||
    statusesQuery.isError ||
    statusGroupsQuery.isError
  ) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg font-bold text-secondary-foreground">
            Error loading test details
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Please try selecting another test
          </p>
        </div>
      </div>
    );
  }

  // Format the test data with statuses
  const formattedTest =
    !selectedTest ||
    !currentQuery?.data ||
    !statusesQuery.data ||
    !statusGroupsQuery.data
      ? null
      : formatTestDetails(
          currentQuery.data,
          statusesQuery.data.items,
          statusGroupsQuery.data.items,
          selectedTest.type === 'before-test'
            ? 'beforeTest'
            : selectedTest.type === 'after-test'
            ? 'afterTest'
            : 'test'
        );

  return <TestDetails test={formattedTest} />;
};
