import { useState } from 'react';
import { FiltersList } from './filters-list.js';
import { TitleFilterForm } from './title-filter-form.js';
import { ReportFilterForm } from './report-filter-form.js';
import { LaunchFilterForm } from './launch-filter-form.js';
import { 
  FilterType, 
  FilterPanelView, 
  BaseFilterData, 
  FilterComponentProps,
  FilterOption 
} from './types.js';

export function UnifiedFilter<TFilterData extends BaseFilterData>({
  initialFilters,
  onApply,
  onCancel,
  config
}: FilterComponentProps<TFilterData>) {
  // Internal state for current filters (working copy)
  const [filters, setFilters] = useState<TFilterData>(initialFilters);
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
  const handleApplyTitleFilter = (title: string | undefined) => {
    setFilters(prev => ({
      ...prev,
      title: title || undefined
    } as TFilterData));
    setFilterPanelView(FilterPanelView.FILTERS_LIST);
    setActiveFilterType(FilterType.NONE);
  };

  // Handler for applying report filter changes
  const handleApplyReportFilter = (report: FilterOption | undefined) => {
    setFilters(prev => ({
      ...prev,
      report: report
    } as TFilterData));
    setFilterPanelView(FilterPanelView.FILTERS_LIST);
    setActiveFilterType(FilterType.NONE);
  };

  // Handler for applying launch filter changes
  const handleApplyLaunchFilter = (launch: FilterOption | undefined) => {
    setFilters(prev => ({
      ...prev,
      launch: launch
    } as TFilterData));
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
          config={config}
        />
      );
    
    case FilterPanelView.FILTER_FORM:
      if (activeFilterType === FilterType.TITLE) {
        return (
          <TitleFilterForm 
            initialValue={filters.title}
            onCancel={handleCancelFilter}
            onApply={handleApplyTitleFilter}
            entityName={config.entityName}
            showHeader={config.showHeader}
          />
        );
      }
      if (activeFilterType === FilterType.REPORT) {
        return (
          <ReportFilterForm 
            initialValue={filters.report}
            onCancel={handleCancelFilter}
            onApply={handleApplyReportFilter}
            entityName={config.entityName}
            showHeader={config.showHeader}
          />
        );
      }
      if (activeFilterType === FilterType.LAUNCH) {
        return (
          <LaunchFilterForm 
            initialValue={filters.launch}
            onCancel={handleCancelFilter}
            onApply={handleApplyLaunchFilter}
            entityName={config.entityName}
            showHeader={config.showHeader}
          />
        );
      }
      return null;
    
    default:
      return null;
  }
}
