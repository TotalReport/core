import React from "react";
import { FilterInput } from "./ui/FilterInput";
import { getUrlParamValue } from "@/lib/url-utils";

export interface ReportsFilterProps {
  onFilterChange: (filters: ReportFilters) => void;
  className?: string;
}

export interface ReportFilters {
  titleFilter: string;
}

export function ReportsFilter({ onFilterChange, className }: ReportsFilterProps) {
  // Initialize from URL params if they exist
  const initialTitleFilter = getUrlParamValue("title~cnt", "");

  const handleTitleFilterChange = (value: string) => {
    onFilterChange({ 
      titleFilter: value 
    });
  };

  return (
    <div className={className}>
      <FilterInput
        placeholder="Filter reports by title..."
        value={initialTitleFilter}
        onChange={handleTitleFilterChange}
      />
    </div>
  );
}
