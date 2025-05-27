"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useFindLaunches } from "@/hooks/launches/use-find-launches";
import { useUrlParams } from "@/hooks/use-url-params";
import { FiltersData, LaunchEntity } from "@/types/launch";
import { Funnel } from "lucide-react";
import { useEffect, useState } from "react";
import LaunchFilters from "./launch-filters";
import LaunchItem from "./launch-item";
import PaginationBar from "./pagination-bar";

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
  const { getNumericParam, updateParams } = useUrlParams();

  // Pagination state
  const [page, setPage] = useState(() =>
    Math.max(1, getNumericParam("page") || 1)
  );
  const [pageSize, setPageSize] = useState(() =>
    Math.max(10, getNumericParam("pageSize") || 10)
  );

  // Report filter state
  const [selectedReportId, setSelectedReportId] = useState<number | null>(
    () => getNumericParam("reportId") || null
  );
  const [selectedReportTitle, setSelectedReportTitle] = useState<string>("");

  // Panel view state (launches list or filters)
  const [panelView, setPanelView] = useState<PanelView>(
    PanelView.LAUNCHES_LIST
  );

  // Fetch launches data using the new hook
  const launchesQuery = useFindLaunches({
    offset: (page - 1) * pageSize,
    limit: pageSize,
    reportId: selectedReportId || undefined,
  });

  // Derived states from the query
  const launchesData = launchesQuery.data?.body;
  const launchesLoading = launchesQuery.isPending;
  const launchesError = launchesQuery.error;

  // Update URL when pagination or filters change
  useEffect(() => {
    const params: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (selectedReportId) {
      params.reportId = selectedReportId.toString();
    }

    updateParams(params);
  }, [page, pageSize, selectedReportId, updateParams]);

  // Handle launch click
  const handleLaunchClick = (launch: LaunchEntity) => {
    onLaunchSelect(launch.id);
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
  const handleApplyFilters = (filters: FiltersData) => {
    setSelectedReportId(filters.report?.id || null);
    setSelectedReportTitle(filters.report?.title || "");
    setPanelView(PanelView.LAUNCHES_LIST);
    setPage(1); // Reset to first page when filters change
  };

  // Handle canceling filters
  const handleCancelFilters = () => {
    setPanelView(PanelView.LAUNCHES_LIST);
  };

  // Calculate active filters count
  const activeFiltersCount = selectedReportId ? 1 : 0;

  // Get current filters
  const getCurrentFilters = (): FiltersData => ({
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
          <LaunchFilters
            initialFilters={getCurrentFilters()}
            onApply={handleApplyFilters}
            onCancel={handleCancelFilters}
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
                      {(launchesError as Error).message}
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
                        onClick={() => handleLaunchClick(launch)}
                      />
                    ))}
                  </div>
                )}
            </ScrollArea>

            {launchesData && (
              <PaginationBar
                page={page}
                pageSize={pageSize}
                totalItems={launchesData.pagination.total}
                onPageChange={setPage}
                onPageSizeChange={setPageSize}
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
