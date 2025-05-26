'use client';

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ReportFilters } from "@/types/report-filters";

interface ReportFilterProps {
  initialTitle: string;
  onFilterChange: (filters: ReportFilters) => void;
}

export const ReportFilter = ({ initialTitle, onFilterChange }: ReportFilterProps) => {
  const [titleFilter, setTitleFilter] = useState(initialTitle);
  
  // Debounce filter changes
  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({ titleFilter });
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [titleFilter, onFilterChange]);

  return (
    <div>
      <Input
        placeholder="Filter reports by title..."
        value={titleFilter}
        onChange={(e) => setTitleFilter(e.target.value)}
        className="w-full"
      />
    </div>
  );
};
