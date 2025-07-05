// Common filter types that can be used across different entities

export enum FilterType {
  NONE = "none",
  TITLE = "title",
  REPORT = "report",
  LAUNCH = "launch",
}

export enum FilterPanelView {
  FILTERS_LIST,
  FILTER_FORM,
}

// Base filter option interface
export interface FilterOption {
  id: number;
  title: string;
}

// Common filter data structure
export interface BaseFilterData {
  title?: string;
  report?: FilterOption;
  launch?: FilterOption;
}

// Configuration for available filters per entity
export interface FilterConfig {
  availableFilters: FilterType[];
  entityName: string; // e.g., "tests", "launches", "reports"
  showHeader?: boolean; // Whether to show the entity header (defaults to true)
}

// Props for filter form components
export interface FilterFormProps<T = any> {
  onCancel: () => void;
  onApply: (value: T | undefined) => void;
  initialValue?: T;
  entityName?: string; // e.g., "tests", "launches", "reports"
  showHeader?: boolean; // Whether to show the entity header (defaults to true)
}

// Props for the main filter component
export interface FilterComponentProps<TFilterData extends BaseFilterData> {
  initialFilters: TFilterData;
  onApply: (filters: TFilterData) => void;
  onCancel: () => void;
  config: FilterConfig;
}
