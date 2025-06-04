import { useState } from 'react';
import { Button } from '@/components/ui/button.js';
import { FiltersData } from './launches-list.js';
import ReportFilter from '@/components/reports/report-filter.js';

// Enum for available filter types
export enum FilterType {
  NONE = "none",
  REPORT = "report"
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
  filters: FiltersData;
}

function FiltersList({ onSelectFilter, onApply, onCancel, filters }: FiltersListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-4 flex-1">
        <div className="space-y-3">
          {filters.report ? (
            // Show selected report as an active filter
            <div className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors border-primary bg-accent/30">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-sm font-medium">Report</h3>
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
              description="Filter launches by report"
              onClick={() => onSelectFilter(FilterType.REPORT)}
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

// Report filter form component
interface ReportFilterFormProps {
  onCancel: () => void;
  onApply: (reportId: number | null, reportTitle: string) => void;
  initialReportId: number | null;
  initialReportTitle: string;
}

function ReportFilterForm({ 
  onCancel, 
  onApply,
  initialReportId,
  initialReportTitle
}: ReportFilterFormProps) {
  const [selectedReportId, setSelectedReportId] = useState<number | null>(initialReportId);
  const [selectedReportTitle, setSelectedReportTitle] = useState<string>(initialReportTitle);
  const [reportSearchQuery, setReportSearchQuery] = useState<string|undefined>(undefined);

  const handleReportSelect = (reportId: number | null, reportTitle: string) => {
    setSelectedReportId(reportId);
    setSelectedReportTitle(reportTitle);
  };

  // Create selected report object for ReportFilter
  const selectedReport = selectedReportId 
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
          onReportSelect={handleReportSelect}
          onSearch={setReportSearchQuery}
        />
      </div>
      
      <div className="mt-auto p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
};

// Main LaunchFilters component that handles filter form display logic
interface LaunchFiltersProps {
  initialFilters: FiltersData;
  onApply: (filters: FiltersData) => void;
  onCancel: () => void;
}

export default function LaunchFilters({
  initialFilters,
  onApply,
  onCancel
}: LaunchFiltersProps) {
  // Internal state for current filters (working copy)
  const [filters, setFilters] = useState<FiltersData>(initialFilters);
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

  // Handler for applying report filter changes
  const handleApplyReportFilter = (reportId: number | null, reportTitle: string) => {
    setFilters(prev => ({
      ...prev,
      report: reportId ? { id: reportId, title: reportTitle } : undefined
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
      if (activeFilterType === FilterType.REPORT) {
        return (
          <ReportFilterForm 
            initialReportId={filters.report?.id || null}
            initialReportTitle={filters.report?.title || ""}
            onCancel={handleCancelFilter}
            onApply={handleApplyReportFilter}
          />
        );
      }
      return null;
    
    default:
      return null;
  }
}
