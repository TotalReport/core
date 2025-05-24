import { tsr } from "@/lib/react-query";
import { totalPagesCount } from "@/lib/pagination-utils";
import { getUrlParamNumber } from "@/lib/url-utils";
import { useEffect, useState } from "react";
import { PaginationBlock } from "./pagination-block";
import { RestAPIProvider } from "./RestAPIProvider";
import { LaunchListItem, type LaunchEntity } from "./launches-list-item";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { StandaloneLaunchDetails } from "./StandaloneLaunchDetails";
import { ReportFilter, type Report } from "./ReportFilter";
import { useFindReport } from "@/lib/hooks/useFindReport";
import { useFindReports } from "@/lib/hooks/useFindReports";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";

// Enum for available filter types
enum FilterType {
  NONE = "none",
  REPORT = "report"
}

// Type for possible view states in the left panel
enum PanelView {
  LAUNCHES_LIST,
  FILTERS_LIST,
  FILTER_FORM
}

// Available filter option component
interface FilterOptionProps {
  title: string;
  description: string;
  onClick: () => void;
}

const FilterOption = ({ title, description, onClick }: FilterOptionProps) => {
  return (
    <div 
      className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors"
      onClick={onClick}
    >
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
};

// Filters list component
interface FiltersListProps {
  onSelectFilter: (filterType: FilterType) => void;
}

const FiltersList = ({ onSelectFilter }: FiltersListProps) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold">Available Filters</h2>
      <div className="space-y-3">
        <FilterOption
          title="Report Filter"
          description="Filter launches by report"
          onClick={() => onSelectFilter(FilterType.REPORT)}
        />
      </div>
    </div>
  );
};

// Report filter form component
interface ReportFilterFormProps {
  onCancel: () => void;
  onApply: (reportId: number | null, reportTitle: string) => void;
  initialReportId: number | null;
  initialReportTitle: string;
}

const ReportFilterForm = ({ 
  onCancel, 
  onApply,
  initialReportId,
  initialReportTitle
}: ReportFilterFormProps) => {
  const [selectedReportId, setSelectedReportId] = useState<number | null>(initialReportId);
  const [selectedReportTitle, setSelectedReportTitle] = useState<string>(initialReportTitle);
  const [reportSearchQuery, setReportSearchQuery] = useState<string|undefined>(undefined);

  // Reports query for filter
  const reportsQuery = useFindReports({
    offset: 0,
    limit: 10,
    titleContains: reportSearchQuery
  });

  const handleReportSelect = (reportId: number | null, reportTitle: string) => {
    setSelectedReportId(reportId);
    setSelectedReportTitle(reportTitle);
  };

  // Create selected report object for ReportFilter
  const selectedReport: Report | null = selectedReportId 
    ? { id: selectedReportId, title: selectedReportTitle }
    : null;

  const handleApply = () => {
    onApply(selectedReportId, selectedReportTitle);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Filter by Report</h2>
        
        <ReportFilter 
          selected={selectedReport}
          reports={reportsQuery.data?.body?.items || []}
          isLoading={reportsQuery.isPending}
          onReportSelect={handleReportSelect}
          onSearch={setReportSearchQuery}
        />
      </div>
      
      <div className="mt-auto p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleApply}>Apply Filter</Button>
      </div>
    </div>
  );
};

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
  
  // Left panel view state (launches list, filters list, or filter form)
  const [panelView, setPanelView] = useState<PanelView>(PanelView.LAUNCHES_LIST);
  
  // Active filter type when in filter form view
  const [activeFilterType, setActiveFilterType] = useState<FilterType>(FilterType.NONE);

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
    setPanelView(PanelView.FILTERS_LIST);
  };

  // Handler for selecting a filter type from the filters list
  const handleSelectFilter = (filterType: FilterType) => {
    setActiveFilterType(filterType);
    setPanelView(PanelView.FILTER_FORM);
  };

  // Handler for canceling filter form
  const handleCancelFilter = () => {
    setPanelView(PanelView.LAUNCHES_LIST);
  };

  // Handler for applying report filter
  const handleApplyReportFilter = (reportId: number | null, reportTitle: string) => {
    setSelectedReportId(reportId);
    setSelectedReportTitle(reportTitle);
    setPanelView(PanelView.LAUNCHES_LIST);
    setPage(1); // Reset to first page when filter is applied
  };

  // Helper to render active filter badges
  const renderFilterBadges = () => {
    if (selectedReportId) {
      return (
        <div className="flex gap-2 px-4 py-2">
          <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs flex items-center gap-1">
            <span>Report: {selectedReportTitle || `#${selectedReportId}`}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  // Render appropriate content for the left panel based on current view
  const renderLeftPanelContent = () => {
    switch (panelView) {
      case PanelView.FILTERS_LIST:
        return <FiltersList onSelectFilter={handleSelectFilter} />;
      
      case PanelView.FILTER_FORM:
        if (activeFilterType === FilterType.REPORT) {
          return (
            <ReportFilterForm 
              initialReportId={selectedReportId}
              initialReportTitle={selectedReportTitle}
              onCancel={handleCancelFilter}
              onApply={handleApplyReportFilter}
            />
          );
        }
        return null;
      
      case PanelView.LAUNCHES_LIST:
      default:
        return (
          <>
            {renderFilterBadges()}
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
            {panelView === PanelView.LAUNCHES_LIST && (
              <Button variant="outline" size="sm" onClick={handleFilterButtonClick}>
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter</span>
              </Button>
            )}
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