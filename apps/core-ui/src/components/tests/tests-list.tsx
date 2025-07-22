import { useTestsList, PanelView } from '@/hooks/use-tests-list.js';
import { TestsListSidebar } from './tests-list-sidebar.jsx';
import { TestDetailsContainer } from './test-details-container.jsx';
import { TestListItem } from './test-list-item.jsx';
import { UnifiedFilter } from '@/components/common/filters/unified-filter.js';
import { FilterType, FilterConfig } from '@/components/common/filters/types.js';
import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';
import { Separator } from '@/components/ui/separator.js';
import { ScrollArea } from '@/components/ui/scroll-area.js';
import { PaginationBlock } from '@/components/ui/pagination-block.jsx';
import { Filter } from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable.js';

// Configuration for available filters in tests page
const testsFilterConfig: FilterConfig = {
  availableFilters: [FilterType.TITLE, FilterType.REPORT, FilterType.LAUNCH, FilterType.ENTITY_TYPE],
  entityName: 'tests',
  showHeader: false // Don't show header since parent component already has one
};

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
          <UnifiedFilter 
            initialFilters={getCurrentFilters()}
            onApply={handleApplyAllFilters}
            onCancel={handleCancelAllFilters}
            config={testsFilterConfig}
          />
        );
      
      case PanelView.TESTS_LIST:
      default:
        return (
          <>
            <ScrollArea className="flex-1 overflow-hidden">
              {/* Test list content without header - header is now at the top level */}
              {testEntitiesQuery.isPending && (
                <p className="p-4">Loading tests...</p>
              )}
              
              {!testEntitiesQuery.isPending &&
                formattedTestEntities.length === 0 && (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-center">
                      <p className="text-lg font-bold text-secondary-foreground">
                        No tests found
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting filters
                      </p>
                    </div>
                  </div>
                )}
              
              {!testEntitiesQuery.isPending &&
                formattedTestEntities.length > 0 && (
                  <div className="flex flex-col gap-2 p-2">
                    {formattedTestEntities.map((test) => (
                      <TestListItem
                        key={`${test.id}-${test.entityType}`}
                        test={test}
                        selected={
                          test.id === (selectedTest?.id || null) &&
                          test.entityType === (
                            selectedTest?.type === 'before-test'
                              ? 'beforeTest'
                              : selectedTest?.type === 'after-test'
                              ? 'afterTest'
                              : selectedTest?.type === 'test'
                              ? 'test'
                              : null
                          )
                        }
                        onClick={() => handleTestClick(test)}
                      />
                    ))}
                  </div>
                )}
            </ScrollArea>

            {testEntitiesQuery.data && (
              <div className="border-t">
                <PaginationBlock
                  page={page}
                  pageSize={pageSize}
                  totalItems={testEntitiesQuery.data.pagination.total}
                  setPage={setPage}
                  setPageSize={setPageSize}
                />
              </div>
            )}
          </>
        );
    }
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full border items-stretch"
    >
      <ResizablePanel defaultSize={20} collapsible={false} minSize={25}>
        <div className="flex flex-col h-full">
          {/* Header with Tests title and filter button - always visible */}
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-xl font-bold">Tests</h1>
            <Button
              variant={
                panelView !== PanelView.TESTS_LIST ? "default" : "outline"
              }
              size="sm"
              onClick={handleFilterButtonClick}
            >
              <Filter className="h-4 w-4 mr-2" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
          <Separator />
          {renderLeftPanelContent()}
        </div>
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
