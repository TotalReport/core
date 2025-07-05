import { useTestsList, PanelView } from '@/hooks/use-tests-list.js';
import { TestsListSidebar } from './tests-list-sidebar.jsx';
import { TestDetailsContainer } from './test-details-container.jsx';
import { TestFilters } from './test-filter.jsx';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable.js';

export const TestsList = () => {
  const {
    page,
    pageSize,
    selectedTest,
    panelView,
    activeFiltersCount,
    testEntitiesQuery,
    formattedTestEntities,
    handleTestClick,
    handleFilterButtonClick,
    handleApplyAllFilters,
    handleCancelAllFilters,
    getCurrentFilters,
    setPage,
    setPageSize,
  } = useTestsList();

  // Render appropriate content for the left panel based on current view
  const renderLeftPanelContent = () => {
    switch (panelView) {
      case PanelView.FILTERS_VIEW:
        return (
          <TestFilters 
            initialFilters={getCurrentFilters()}
            onApply={handleApplyAllFilters}
            onCancel={handleCancelAllFilters}
          />
        );
      
      case PanelView.TESTS_LIST:
      default:
        return (
          <TestsListSidebar
            page={page}
            pageSize={pageSize}
            panelView={panelView}
            activeFiltersCount={activeFiltersCount}
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
            onFilterButtonClick={handleFilterButtonClick}
            setPage={setPage}
            setPageSize={setPageSize}
          />
        );
    }
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full border items-stretch"
    >
      <ResizablePanel defaultSize={20} collapsible={false} minSize={25}>
        {renderLeftPanelContent()}
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
