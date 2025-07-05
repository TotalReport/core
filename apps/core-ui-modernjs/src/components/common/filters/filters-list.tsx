import { Button } from '@/components/ui/button.js';
import { Separator } from '@/components/ui/separator.js';
import { ArrowLeft } from 'lucide-react';
import { FilterOption } from './filter-option.js';
import { FilterType, BaseFilterData, FilterConfig } from './types.js';

interface FiltersListProps<TFilterData extends BaseFilterData> {
  onSelectFilter: (filterType: FilterType) => void;
  onApply: () => void;
  onCancel: () => void;
  filters: TFilterData;
  config: FilterConfig;
}

export function FiltersList<TFilterData extends BaseFilterData>({ 
  onSelectFilter, 
  onApply, 
  onCancel,
  filters,
  config
}: FiltersListProps<TFilterData>) {
  const { availableFilters, entityName, showHeader = true } = config;

  const renderFilterOption = (filterType: FilterType) => {
    switch (filterType) {
      case FilterType.TITLE:
        return filters.title ? (
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
          <FilterOption
            title="Title Filter"
            description={`Filter ${entityName} by title`}
            onClick={() => onSelectFilter(FilterType.TITLE)}
          />
        );

      case FilterType.REPORT:
        return filters.report ? (
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
          <FilterOption
            title="Report Filter"
            description={`Filter ${entityName} by report`}
            onClick={() => onSelectFilter(FilterType.REPORT)}
          />
        );

      case FilterType.LAUNCH:
        return filters.launch ? (
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
          <FilterOption
            title="Launch Filter"
            description={`Filter ${entityName} by launch`}
            onClick={() => onSelectFilter(FilterType.LAUNCH)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with entity name and back button - conditionally rendered */}
      {showHeader && (
        <>
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-xl font-bold capitalize">{entityName}</h1>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onCancel}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <Separator />
        </>
      )}
      
      <div className="p-4 space-y-4 flex-1">
        <div className="space-y-3">
          {availableFilters.map((filterType) => (
            <div key={filterType}>
              {renderFilterOption(filterType)}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onApply}>Apply All</Button>
      </div>
    </div>
  );
}
