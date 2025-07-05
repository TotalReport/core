import { useState } from 'react';
import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Search } from 'lucide-react';

// Enum for available filter types
export enum FilterType {
  NONE = "none",
  TITLE = "title"
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

// Interface for filters data structure
export interface TestFiltersData {
  title?: string;
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
      return null;
    
    default:
      return null;
  }
};
