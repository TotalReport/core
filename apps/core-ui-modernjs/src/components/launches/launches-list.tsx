import { Badge } from '@/components/ui/badge.js';
import { Button } from '@/components/ui/button.js';
import { ScrollArea } from '@/components/ui/scroll-area.js';
import { Separator } from '@/components/ui/separator.js';
import { useFindLaunches } from '@/hooks/api/launches/use-find-launches.js';
import { useUrlParams } from '@/hooks/url/use-url-params.jsx';
import { Funnel } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PaginationBlock } from '../ui/pagination-block.jsx';
import { UnifiedFilter } from '@/components/common/filters/unified-filter.js';
import { FilterType, FilterConfig, BaseFilterData } from '@/components/common/filters/types.js';
import LaunchItem from './launch-item.js';
import { usePageParam, usePageSizeParam } from '@/hooks/url/use-common-list-params.jsx';

// Configuration for available filters in launches page
const launchesFilterConfig: FilterConfig = {
  availableFilters: [FilterType.TITLE, FilterType.REPORT],
  entityName: 'launches',
  showHeader: false // Don't show header since parent component already has one
};

// Type for possible view states in the left panel
enum PanelView {
  LAUNCHES_LIST,
  FILTERS_VIEW,
}

interface LaunchesListProps {
  selectedLaunchId: number | null;
  onLaunchSelect: (launchId: number) => void;
}

export default function LaunchesList({
  selectedLaunchId,
  onLaunchSelect,
}: LaunchesListProps) {
  const { getNumericParam, getParam, updateParams } = useUrlParams();

  // Pagination state
  const [page, setPage] = usePageParam(1);
  const [pageSize, setPageSize] = usePageSizeParam(10);

  // Title filter state
  const [titleFilter, setTitleFilter] = useState<string>(() => getParam('title~cnt') || '');

  // Report filter state
  const [selectedReportId, setSelectedReportId] = useState<number | null>(
    () => getNumericParam('reportId') || null
  );
  const [selectedReportTitle, setSelectedReportTitle] = useState<string>('');

  // Panel view state (launches list or filters)
  const [panelView, setPanelView] = useState<PanelView>(
    PanelView.LAUNCHES_LIST
  );
  // Fetch launches data using the hook
  const launchesQuery = useFindLaunches({
    pagination: {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    },
    filters: {
      reportId: selectedReportId ?? undefined,
      titleContains: titleFilter || undefined,
    },
    enabled: true,
  });

  // Derived states from the query
  const launchesData = launchesQuery.data;
  const launchesLoading = launchesQuery.isPending;
  const launchesError = launchesQuery.isError;

  // Update URL when pagination or filters change
  useEffect(() => {
    const params: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (titleFilter) {
      params['title~cnt'] = titleFilter;
    }

    if (selectedReportId) {
      params.reportId = selectedReportId.toString();
    }

    updateParams(params);
  }, [page, pageSize, titleFilter, selectedReportId, updateParams]);

  // Handle launch click
  const handleLaunchClick = (launchId: number) => {
    onLaunchSelect(launchId);
  };

  // Handle filter button click
  const handleFilterButtonClick = () => {
    if (panelView === PanelView.LAUNCHES_LIST) {
      setPanelView(PanelView.FILTERS_VIEW);
    } else {
      setPanelView(PanelView.LAUNCHES_LIST);
    }
  };

  // Handle applying all filters
  const handleApplyFilters = (filters: BaseFilterData) => {
    setTitleFilter(filters.title || '');
    setSelectedReportId(filters.report?.id || null);
    setSelectedReportTitle(filters.report?.title || '');
    setPanelView(PanelView.LAUNCHES_LIST);
    setPage(1); // Reset to first page when filters change
  };

  // Handle canceling filters
  const handleCancelFilters = () => {
    setPanelView(PanelView.LAUNCHES_LIST);
  };

  // Calculate active filters count
  const activeFiltersCount = (titleFilter ? 1 : 0) + (selectedReportId ? 1 : 0);

  // Get current filters
  const getCurrentFilters = (): BaseFilterData => ({
    title: titleFilter || undefined,
    report: selectedReportId
      ? {
          id: selectedReportId,
          title: selectedReportTitle,
        }
      : undefined,
  });

  // Render appropriate content based on current panel view
  const renderPanelContent = () => {
    switch (panelView) {
      case PanelView.FILTERS_VIEW:
        return (
          <UnifiedFilter
            initialFilters={getCurrentFilters()}
            onApply={handleApplyFilters}
            onCancel={handleCancelFilters}
            config={launchesFilterConfig}
          />
        );

      case PanelView.LAUNCHES_LIST:
      default:
        return (
          <>
            <ScrollArea className="flex-1">
              {launchesLoading && <p className="p-4">Loading launches...</p>}
              {!launchesLoading && launchesError && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-lg font-bold text-destructive">
                      Error loading launches
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Unable to fetch launch data
                    </p>
                  </div>
                </div>
              )}
              {!launchesLoading &&
                !launchesError &&
                launchesData?.items?.length === 0 && (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-center">
                      <p className="text-lg font-bold text-secondary-foreground">
                        No launches found
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try adjusting filters
                      </p>
                    </div>
                  </div>
                )}
              {!launchesLoading &&
                !launchesError &&
                launchesData?.items != undefined &&
                launchesData?.items?.length > 0 && (
                  <div className="flex flex-col gap-2 p-2">
                    {launchesData.items.map((launch) => (
                      <LaunchItem
                        key={launch.id}
                        launch={launch}
                        selected={launch.id === selectedLaunchId}
                        onClick={() => handleLaunchClick(launch.id)}
                      />
                    ))}
                  </div>
                )}
            </ScrollArea>

            {launchesData && (
              <PaginationBlock
                page={page}
                pageSize={pageSize}
                totalItems={launchesData.pagination.total}
                setPage={setPage}
                setPageSize={setPageSize}
              />
            )}
          </>
        );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2">
        <h1 className="text-xl font-bold">Launches</h1>
        <Button
          variant={
            panelView !== PanelView.LAUNCHES_LIST ? "default" : "outline"
          }
          size="sm"
          onClick={handleFilterButtonClick}
        >
          <Funnel className="h-4 w-4 mr-2" aria-hidden="true" />
          <span>Filter</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>
      <Separator />
      {renderPanelContent()}
    </div>
  );
}
