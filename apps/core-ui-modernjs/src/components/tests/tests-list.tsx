import { useTestsList } from '@/hooks/use-tests-list.js';
import { TestsListSidebar } from './tests-list-sidebar.jsx';
import { TestDetailsContainer } from './test-details-container.jsx';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable.js';

export const TestsList = () => {
  const {
    page,
    pageSize,
    titleFilter,
    selectedTest,
    testEntitiesQuery,
    formattedTestEntities,
    handleTestClick,
    handleFilterChange,
    setPage,
    setPageSize,
  } = useTestsList();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full border items-stretch"
    >
      <ResizablePanel defaultSize={20} collapsible={false} minSize={25}>
        <TestsListSidebar
          page={page}
          pageSize={pageSize}
          titleFilter={titleFilter}
          testEntitiesQuery={testEntitiesQuery}
          formattedTestEntities={formattedTestEntities}
          selectedTestId={selectedTest?.id || null}
          selectedTestType={
            selectedTest?.type === 'before-test'
              ? 'beforeTest'
              : selectedTest?.type === 'after-test'
              ? 'afterTest'
              : selectedTest?.type === 'test'
              ? 'test'
              : null
          }
          onTestClick={handleTestClick}
          onFilterChange={handleFilterChange}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        {selectedTest == null && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-bold text-secondary-foreground">
                No test selected
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Select a test from the list to view details
              </p>
            </div>
          </div>
        )}
        {selectedTest != null && (
          <TestDetailsContainer selectedTest={selectedTest} />
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
