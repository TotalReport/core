import { useState, useEffect } from "react";
import { FilterInput } from "./ui/FilterInput";
import { Button } from "./ui/button";
import { Check, Filter, X } from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export interface Report {
  id: number;
  title: string;
}

export interface ReportFilterProps {
  selected: Report | null;
  reports: Report[];
  isLoading: boolean;
  onReportSelect: (reportId: number | null, reportTitle: string) => void;
  onSearch: (query: string) => void;
}

// Report Filter Content component for the filter panel
interface ReportFilterContentProps {
  isOpen: boolean;
  selected: Report | null;
  reports: Report[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onReportSelect: (reportId: number, reportTitle: string) => void;
}

export const ReportFilterContent = ({
  isOpen,
  selected,
  reports,
  isLoading,
  searchQuery,
  onSearchChange,
  onReportSelect,
}: ReportFilterContentProps) => {
  if (!isOpen) return null;

  return (
    <div className="p-4 border rounded-md shadow-sm mt-2">
      <h3 className="text-sm font-medium mb-2">Filter by Report</h3>
      <FilterInput
        placeholder="Search reports..."
        value={searchQuery}
        onChange={onSearchChange}
        className="mb-2"
      />
      <div className="max-h-48 overflow-y-auto">
        {isLoading && (
          <p className="text-sm text-muted-foreground p-2">
            Loading reports...
          </p>
        )}
        {!isLoading && reports.length === 0 && (
          <p className="text-sm text-muted-foreground p-2">No reports found</p>
        )}
        {!isLoading &&
          reports.map((report) => (
            <button
              key={report.id}
              className="flex items-center justify-between w-full text-left px-2 py-1.5 hover:bg-accent rounded-sm"
              onClick={() => onReportSelect(report.id, report.title)}
            >
              <span className="truncate">{report.title}</span>
              {report.id === selected?.id && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </button>
          ))}
      </div>
    </div>
  );
};

// Report Filter Button component for the dropdown trigger
interface ReportFilterButtonProps {
  selected: Report | null;
  onFilterOpen: () => void;
  onClearFilter: () => void;
}

export const ReportFilterButton = ({
  selected,
  onFilterOpen,
  onClearFilter,
}: ReportFilterButtonProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleOpenFilter = () => {
    setDropdownOpen(false);
    onFilterOpen();
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleOpenFilter();
            }}
          >
            Filter by Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {selected && (
        <div className="flex gap-2 mt-2">
          <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs flex items-center gap-1">
            <span>Report: {selected.title || `#${selected.id}`}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={onClearFilter}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove report filter</span>
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

// Main ReportFilter component that composes the button and content
export const ReportFilter = ({
  selected,
  reports,
  isLoading,
  onReportSelect,
  onSearch,
}: ReportFilterProps) => {
  const [reportFilterOpen, setReportFilterOpen] = useState(false);
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const debouncedReportSearch = useDebounce(reportSearchQuery, 300);

  // Update report filter query when search query changes
  useEffect(() => {
    onSearch(debouncedReportSearch);
  }, [debouncedReportSearch, onSearch]);

  const handleOpenReportFilter = () => {
    setReportFilterOpen(true);
  };

  const handleReportSelect = (reportId: number, reportTitle: string) => {
    onReportSelect(reportId, reportTitle);
    setReportFilterOpen(false);
    setReportSearchQuery("");
  };

  const clearReportFilter = () => {
    onReportSelect(null, "");
  };

  return (
    <>
      <ReportFilterButton
        selected={selected}
        onFilterOpen={handleOpenReportFilter}
        onClearFilter={clearReportFilter}
      />

      <ReportFilterContent
        isOpen={reportFilterOpen}
        selected={selected}
        reports={reports}
        isLoading={isLoading}
        searchQuery={reportSearchQuery}
        onSearchChange={setReportSearchQuery}
        onReportSelect={handleReportSelect}
      />
    </>
  );
};
