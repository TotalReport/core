import { FilterConfig, FilterType } from "@/components/common/filters/types.js";
import { UnifiedFilter } from "@/components/common/filters/unified-filter.js";
import { Badge } from "@/components/ui/badge.js";
import { Button } from "@/components/ui/button.js";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.js";
import { Separator } from "@/components/ui/separator.js";
import { TestsList } from "@/containers/tests-list/tests-list.jsx";
import {
  PanelView,
  SelectedTest,
  useTestsList,
} from "@/hooks/use-tests-list.js";
import { Filter } from "lucide-react";
import { TestDetails } from "@/containers/test-details/test-details.jsx";

// Configuration for available filters in tests page
const testsFilterConfig: FilterConfig = {
  availableFilters: [
    FilterType.TITLE,
    FilterType.REPORT,
    FilterType.LAUNCH,
    FilterType.ENTITY_TYPE,
  ],
  entityName: "tests",
  showHeader: false, // Don't show header since parent component already has one
};

export const TestsListBlock = () => {
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
        const filters = getCurrentFilters();
        return (
          <TestsList
            pagination={{ page, pageSize, setPage, setPageSize }}
            selection={{
              selectedId: selectedTest?.id,
              onSelect: handleTestClick,
            }}
            filters={{
              reportId: filters?.report?.id,
              titleContains: filters.title,
              launchId: filters.launch?.id,
              entityTypes: filters.entityTypes as (
                | "beforeTest"
                | "test"
                | "afterTest"
              )[],
            }}
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
      <ResizablePanel>{renderTestDetails(selectedTest)}</ResizablePanel>
    </ResizablePanelGroup>
  );
};

const renderTestDetails = (selectedTest: SelectedTest | null) => {
  if (selectedTest == null) {
    return (
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
    );
  }

  return (
    <TestDetails entityId={selectedTest?.id} entityType={selectedTest?.type} />
  );
};
