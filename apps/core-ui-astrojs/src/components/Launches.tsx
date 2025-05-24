import { useFindReport } from "@/lib/hooks/useFindReport";
import { totalPagesCount } from "@/lib/pagination-utils";
import { tsr } from "@/lib/react-query";
import { getUrlParamNumber } from "@/lib/url-utils";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { LaunchListItem, type LaunchEntity } from "./launches-list-item";
import { LaunchFilters, type FiltersData } from "./LaunchFilters";
import { PaginationBlock } from "./pagination-block";
import { RestAPIProvider } from "./RestAPIProvider";
import { StandaloneLaunchDetails } from "./StandaloneLaunchDetails";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

// Type for possible view states in the left panel
enum PanelView {
  LAUNCHES_LIST,
  FILTERS_VIEW
}

const Internal = () => {
  const [page, setPage] = useState(() => Math.max(1, getUrlParamNumber("page", 1)));
  const [pageSize, setPageSize] = useState(() => Math.max(1, getUrlParamNumber("pageSize", 10)));
  
  // Track selected launch ID
  const [selectedLaunchId, setSelectedLaunchId] = useState<number | null>(() => {
    const launchId = getUrlParamNumber("launchId", -1);
    return launchId > 0 ? launchId : null;
  });

  // Report filter state
  const [selectedReportId, setSelectedReportId] = useState<number | null>(() => {
    const reportId = getUrlParamNumber("reportId", -1);
    return reportId > 0 ? reportId : null;
  });
  const [selectedReportTitle, setSelectedReportTitle] = useState<string>("");
  
  // Left panel view state (launches list or filters view)
  const [panelView, setPanelView] = useState<PanelView>(PanelView.LAUNCHES_LIST);

  // Fetch selected report title if we have an ID but no title
  useEffect(() => {
    if (selectedReportId && !selectedReportTitle) {
      const result = useFindReport({id:selectedReportId});
        if (result.data && result.data.status === 201) {
          setSelectedReportTitle(result.data.body.title || `#${selectedReportId}`);
        }
    }
  }, [selectedReportId, selectedReportTitle]);

  // Launches query with report filter
  const launchesQuery = tsr.findLaunches.useQuery({
    queryKey: [`launches?page=${page}&pageSize=${pageSize}&reportId=${selectedReportId}`],
    queryData: {
      query: {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        reportId: selectedReportId || undefined,
      },
    },
  });

  useEffect(() => {
    if (page < 1) setPage(1);
    
    if (pageSize < 1) setPageSize(10);
    
    if (!launchesQuery.isPending) {
      const totalPages = totalPagesCount(
        launchesQuery.data?.body.pagination.total || 0,
        pageSize
      );

      if (page > totalPages && totalPages > 0) {
        setPage(totalPages);
      }
    }
    
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("page", page.toString());
      url.searchParams.set("pageSize", pageSize.toString());
      
      // Update launchId parameter
      if (selectedLaunchId) {
        url.searchParams.set("launchId", selectedLaunchId.toString());
      } else {
        url.searchParams.delete("launchId");
      }
      
      // Update reportId parameter
      if (selectedReportId) {
        url.searchParams.set("reportId", selectedReportId.toString());
      } else {
        url.searchParams.delete("reportId");
      }
      
      window.history.replaceState({}, "", url.toString());
    }
  }, [page, pageSize, selectedLaunchId, selectedReportId, launchesQuery]);

  // Handler for when a launch item is clicked
  const handleLaunchClick = (launch: LaunchEntity) => {
    setSelectedLaunchId(launch.id);
  };

  // Handler for filter button click
  const handleFilterButtonClick = () => {
    // Toggle between launches list and filters view
    if (panelView === PanelView.LAUNCHES_LIST) {
      setPanelView(PanelView.FILTERS_VIEW);
    } else {
      // If already in a filter view, cancel and return to launches list
      setPanelView(PanelView.LAUNCHES_LIST);
    }
  };

  // Handler for canceling all filter changes
  const handleCancelAllFilters = () => {
    // Discard changes and return to launches list
    setPanelView(PanelView.LAUNCHES_LIST);
  };

  // Handler for applying all filter changes
  const handleApplyAllFilters = (filters: FiltersData) => {
    // Apply filter values to the actual filters
    setSelectedReportId(filters.report?.id || null);
    setSelectedReportTitle(filters.report?.title || "");
    
    // Return to launches list
    setPanelView(PanelView.LAUNCHES_LIST);
    setPage(1); // Reset to first page when filters are applied
    
    // Force refetch to apply the new filter
    launchesQuery.refetch();
  };

  // Calculate how many filters are active
  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (selectedReportId) count++;
    return count;
  };

  // Get active filters count
  const activeFiltersCount = getActiveFiltersCount();

  // Get current filters data structure
  const getCurrentFilters = (): FiltersData => {
    return {
      report: selectedReportId ? { 
        id: selectedReportId, 
        title: selectedReportTitle 
      } : undefined
    };
  };

  // Render appropriate content for the left panel based on current view
  const renderLeftPanelContent = () => {
    switch (panelView) {
      case PanelView.FILTERS_VIEW:
        return (
          <LaunchFilters 
            initialFilters={getCurrentFilters()}
            onApply={handleApplyAllFilters}
            onCancel={handleCancelAllFilters}
          />
        );
      
      case PanelView.LAUNCHES_LIST:
      default:
        return (
          <>
            <ScrollArea className="flex-1 overflow-hidden">
              {launchesQuery.isPending && <p className="p-4">Loading...</p>}
              {!launchesQuery.isPending &&
                launchesQuery.data?.body?.items.length === 0 && (
                  <div className="flex items-center justify-center flex-grow">
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
              {!launchesQuery.isPending &&
                launchesQuery.data?.body?.items != undefined &&
                launchesQuery.data?.body?.items.length > 0 && (
                  <div className="flex flex-col gap-2 p-2">
                    {launchesQuery.data.body.items.map((launch) => (
                      <LaunchListItem
                        key={launch.id}
                        launch={launch}
                        selected={launch.id === selectedLaunchId}
                        onClick={() => handleLaunchClick(launch)}
                      />
                    ))}
                  </div>
                )}
            </ScrollArea>
            <PaginationBlock
              page={page}
              pageSize={pageSize}
              totalItems={launchesQuery.data?.body.pagination.total!}
              setPage={setPage}
              setPageSize={setPageSize}
            />
          </>
        );
    }
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full border items-stretch"
    >
      <ResizablePanel
        autoSave="true"
        defaultValue={20}
        collapsible={false}
        minSize={25}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-xl font-bold">Launches</h1>
            <Button 
              variant={panelView !== PanelView.LAUNCHES_LIST ? "default" : "outline"} 
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
        <StandaloneLaunchDetails />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export const LaunchesList = () => {
  return (
    <RestAPIProvider>
      <Internal />
    </RestAPIProvider>
  );
};