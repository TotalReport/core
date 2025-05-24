import { useState, useEffect } from "react";
import { FilterInput } from "./ui/FilterInput";
import { Check } from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";

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

// Main ReportFilter component focusing on filter content
export const ReportFilter = ({
  selected,
  reports,
  isLoading,
  onReportSelect,
  onSearch,
}: ReportFilterProps) => {
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const debouncedReportSearch = useDebounce(reportSearchQuery, 300);

  // Update report filter query when search query changes
  useEffect(() => {
    onSearch(debouncedReportSearch);
  }, [debouncedReportSearch, onSearch]);

  return (
    <div>
      <FilterInput
        placeholder="Search reports..."
        value={reportSearchQuery}
        onChange={setReportSearchQuery}
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
