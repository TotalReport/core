import { useState } from 'react';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Search, Check } from 'lucide-react';
import { useFindReports } from '@/hooks/api/reports/use-find-reports.js';
import { useFindLaunches } from '@/hooks/api/launches/use-find-launches.js';

// Enum for available filter types
export enum FilterType {
  NONE = "none",
  TITLE = "title",
  REPORT = "report",
  LAUNCH = "launch"
}

// Type for possible view states in the filter panel
export enum FilterPanelView {
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
  onApply: () => void;
  onCancel: () => void;
  filters: {
    title?: string;
    report?: {
      id: number;
      title: string;
    };
    launch?: {
      id: number;
      title: string;
    };
  };
}

export const FiltersList = ({ 
  onSelectFilter, 
  onApply, 
  onCancel,
  filters
}: FiltersListProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4 flex-1">
        <div className="space-y-3">
          {filters.title ? (
            // Show selected title filter as an active filter
            <div className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors border-primary bg-accent/30">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium">Title Filter</h3>
                  <p className="text-xs font-medium mt-1 text-primary">{filters.title}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7" 
                  onClick={() => onSelectFilter(FilterType.TITLE)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            // Show option to add a title filter
            <FilterOption
              title="Title Filter"
              description="Filter tests by title"
              onClick={() => onSelectFilter(FilterType.TITLE)}
            />
          )}

          {filters.report ? (
            // Show selected report filter as an active filter
            <div className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors border-primary bg-accent/30">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium">Report Filter</h3>
                  <p className="text-xs font-medium mt-1 text-primary">{filters.report.title}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7" 
                  onClick={() => onSelectFilter(FilterType.REPORT)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            // Show option to add a report filter
            <FilterOption
              title="Report Filter"
              description="Filter tests by report"
              onClick={() => onSelectFilter(FilterType.REPORT)}
            />
          )}

          {filters.launch ? (
            // Show selected launch filter as an active filter
            <div className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors border-primary bg-accent/30">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium">Launch Filter</h3>
                  <p className="text-xs font-medium mt-1 text-primary">{filters.launch.title}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7" 
                  onClick={() => onSelectFilter(FilterType.LAUNCH)}
                >
                  Edit
                </Button>
              </div>
            </div>
          ) : (
            // Show option to add a launch filter
            <FilterOption
              title="Launch Filter"
              description="Filter tests by launch"
              onClick={() => onSelectFilter(FilterType.LAUNCH)}
            />
          )}
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onApply}>Apply All</Button>
      </div>
    </div>
  );
};

// Title filter form component
interface TitleFilterFormProps {
  onCancel: () => void;
  onApply: (title: string) => void;
  initialTitle: string;
}

export const TitleFilterForm = ({ 
  onCancel, 
  onApply,
  initialTitle
}: TitleFilterFormProps) => {
  const [titleFilter, setTitleFilter] = useState<string>(initialTitle);

  const handleApply = () => {
    onApply(titleFilter);
  };

  const handleClear = () => {
    setTitleFilter('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Filter by Title</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tests by title..."
              value={titleFilter}
              onChange={(e) => setTitleFilter(e.target.value)}
              className="pl-8"
            />
          </div>
          
          {titleFilter && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="w-full"
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
};

// Report filter form component
interface ReportFilterFormProps {
  onCancel: () => void;
  onApply: (report: { id: number; title: string } | undefined) => void;
  initialReport?: { id: number; title: string };
}

export const ReportFilterForm = ({ 
  onCancel, 
  onApply,
  initialReport
}: ReportFilterFormProps) => {
  const [selectedReport, setSelectedReport] = useState<{ id: number; title: string } | undefined>(initialReport);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch reports with search functionality
  const reportsQuery = useFindReports({
    pagination: { offset: 0, limit: 50 },
    filters: { titleContains: searchTerm || undefined }
  });

  const handleSelectReport = (report: { id: number; title: string }) => {
    setSelectedReport(report);
  };

  const handleClearSelection = () => {
    setSelectedReport(undefined);
  };

  const handleApply = () => {
    onApply(selectedReport);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Filter by Report</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {selectedReport && (
            <div className="p-3 border rounded-md bg-accent/30 border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Selected Report</p>
                  <p className="text-xs text-muted-foreground">{selectedReport.title}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto space-y-2">
            {reportsQuery.isPending && (
              <div className="text-center text-muted-foreground text-sm py-4">
                Loading reports...
              </div>
            )}
            
            {reportsQuery.isError && (
              <div className="text-center text-destructive text-sm py-4">
                Error loading reports
              </div>
            )}

            {reportsQuery.data?.items.map((report) => (
              <div
                key={report.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedReport?.id === report.id
                    ? 'border-primary bg-accent/30'
                    : 'hover:bg-accent'
                }`}
                onClick={() => handleSelectReport({ id: report.id, title: report.title })}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{report.title}</p>
                  {selectedReport?.id === report.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}

            {reportsQuery.data?.items.length === 0 && !reportsQuery.isPending && (
              <div className="text-center text-muted-foreground text-sm py-4">
                No reports found
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
};

// Launch filter form component
interface LaunchFilterFormProps {
  onCancel: () => void;
  onApply: (launch: { id: number; title: string } | undefined) => void;
  initialLaunch?: { id: number; title: string };
}

export const LaunchFilterForm = ({ 
  onCancel, 
  onApply,
  initialLaunch
}: LaunchFilterFormProps) => {
  const [selectedLaunch, setSelectedLaunch] = useState<{ id: number; title: string } | undefined>(initialLaunch);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch launches with search functionality
  const launchesQuery = useFindLaunches({
    pagination: { offset: 0, limit: 50 },
    filters: { titleContains: searchTerm || undefined }
  });

  const handleSelectLaunch = (launch: { id: number; title: string }) => {
    setSelectedLaunch(launch);
  };

  const handleClearSelection = () => {
    setSelectedLaunch(undefined);
  };

  const handleApply = () => {
    onApply(selectedLaunch);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Filter by Launch</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search launches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {selectedLaunch && (
            <div className="p-3 border rounded-md bg-accent/30 border-primary">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Selected Launch</p>
                  <p className="text-xs text-muted-foreground">{selectedLaunch.title}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          <div className="max-h-60 overflow-y-auto space-y-2">
            {launchesQuery.isPending && (
              <div className="text-center text-muted-foreground text-sm py-4">
                Loading launches...
              </div>
            )}
            
            {launchesQuery.isError && (
              <div className="text-center text-destructive text-sm py-4">
                Error loading launches
              </div>
            )}

            {launchesQuery.data?.items.map((launch) => (
              <div
                key={launch.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedLaunch?.id === launch.id
                    ? 'border-primary bg-accent/30'
                    : 'hover:bg-accent'
                }`}
                onClick={() => handleSelectLaunch({ id: launch.id, title: launch.title })}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{launch.title}</p>
                  {selectedLaunch?.id === launch.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}

            {launchesQuery.data?.items.length === 0 && !launchesQuery.isPending && (
              <div className="text-center text-muted-foreground text-sm py-4">
                No launches found
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
};

// Interface for filters data structure
export interface TestFiltersData {
  title?: string;
  report?: {
    id: number;
    title: string;
  };
  launch?: {
    id: number;
    title: string;
  };
}

// Main TestFilters component that handles filter form display logic
interface TestFiltersProps {
  initialFilters: TestFiltersData;
  onApply: (filters: TestFiltersData) => void;
  onCancel: () => void;
}

export const TestFilters = ({
  initialFilters,
  onApply,
  onCancel
}: TestFiltersProps) => {
  // Internal state for current filters (working copy)
  const [filters, setFilters] = useState<TestFiltersData>(initialFilters);
  // Internal state for view management
  const [filterPanelView, setFilterPanelView] = useState<FilterPanelView>(FilterPanelView.FILTERS_LIST);
  const [activeFilterType, setActiveFilterType] = useState<FilterType>(FilterType.NONE);

  // Handler for selecting a filter type to edit
  const handleSelectFilter = (filterType: FilterType) => {
    setActiveFilterType(filterType);
    setFilterPanelView(FilterPanelView.FILTER_FORM);
  };

  // Handler for canceling filter edits, returns to filter list
  const handleCancelFilter = () => {
    setFilterPanelView(FilterPanelView.FILTERS_LIST);
    setActiveFilterType(FilterType.NONE);
  };

  // Handler for applying title filter changes
  const handleApplyTitleFilter = (title: string) => {
    setFilters(prev => ({
      ...prev,
      title: title || undefined
    }));
    setFilterPanelView(FilterPanelView.FILTERS_LIST);
    setActiveFilterType(FilterType.NONE);
  };

  // Handler for applying report filter changes
  const handleApplyReportFilter = (report: { id: number; title: string } | undefined) => {
    setFilters(prev => ({
      ...prev,
      report: report
    }));
    setFilterPanelView(FilterPanelView.FILTERS_LIST);
    setActiveFilterType(FilterType.NONE);
  };

  // Handler for applying launch filter changes
  const handleApplyLaunchFilter = (launch: { id: number; title: string } | undefined) => {
    setFilters(prev => ({
      ...prev,
      launch: launch
    }));
    setFilterPanelView(FilterPanelView.FILTERS_LIST);
    setActiveFilterType(FilterType.NONE);
  };

  // Handler for applying all filters and notifying parent
  const handleApplyAllFilters = () => {
    onApply(filters);
  };

  // Handler for canceling all filters
  const handleCancelAllFilters = () => {
    onCancel();
  };

  // Render appropriate filter content based on current view
  switch (filterPanelView) {
    case FilterPanelView.FILTERS_LIST:
      return (
        <FiltersList 
          onSelectFilter={handleSelectFilter} 
          onApply={handleApplyAllFilters}
          onCancel={handleCancelAllFilters}
          filters={filters}
        />
      );
    
    case FilterPanelView.FILTER_FORM:
      if (activeFilterType === FilterType.TITLE) {
        return (
          <TitleFilterForm 
            initialTitle={filters.title || ''}
            onCancel={handleCancelFilter}
            onApply={handleApplyTitleFilter}
          />
        );
      }
      if (activeFilterType === FilterType.REPORT) {
        return (
          <ReportFilterForm 
            initialReport={filters.report}
            onCancel={handleCancelFilter}
            onApply={handleApplyReportFilter}
          />
        );
      }
      if (activeFilterType === FilterType.LAUNCH) {
        return (
          <LaunchFilterForm 
            initialLaunch={filters.launch}
            onCancel={handleCancelFilter}
            onApply={handleApplyLaunchFilter}
          />
        );
      }
      return null;
    
    default:
      return null;
  }
};
