import { useState, useEffect } from "react";
import { FilterInput } from "./ui/FilterInput";
import { Button } from "./ui/button";
import { Check, Filter, X } from "lucide-react";
import { tsr } from "@/lib/react-query";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export interface ReportFilterProps {
  selectedReportId: number | null;
  selectedReportTitle: string;
  onReportSelect: (reportId: number | null, reportTitle: string) => void;
}

export const ReportFilter = ({
  selectedReportId,
  selectedReportTitle,
  onReportSelect,
}: ReportFilterProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reportFilterOpen, setReportFilterOpen] = useState(false);
  const [reportSearchQuery, setReportSearchQuery] = useState("");
  const debouncedReportSearch = useDebounce(reportSearchQuery, 300);

  // Report search query
  const reportsQuery = tsr.findReports.useQuery({
    queryKey: [`reports?title=${debouncedReportSearch}`],
    queryData: {
      query: {
        "title~cnt": debouncedReportSearch,
        limit: 10,
        offset: 0,
      },
    },
    enabled: reportFilterOpen,
  });

  // Fetch report title if we have a reportId but no title
  const selectedReportQuery = tsr.readReport.useQuery({
    queryKey: [`report/${selectedReportId}`],
    queryData: {
      params: { id: selectedReportId || 0 },
    },
    enabled: !!selectedReportId && !selectedReportTitle,
  });

  // Update report title when selected report query completes
  useEffect(() => {
    if (selectedReportQuery.data?.body) {
      onReportSelect(selectedReportId, selectedReportQuery.data.body.title);
    }
  }, [selectedReportQuery.data, selectedReportId, onReportSelect]);

  const handleOpenReportFilter = () => {
    // Close dropdown and open report filter panel
    setDropdownOpen(false);
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
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onSelect={(e) => {
            // Prevent default behavior (which would close the dropdown)
            e.preventDefault();
            handleOpenReportFilter();
          }}>
            Filter by Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedReportId && (
        <div className="flex gap-2 mt-2">
          <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs flex items-center gap-1">
            <span>Report: {selectedReportTitle || `#${selectedReportId}`}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={clearReportFilter}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove report filter</span>
            </Button>
          </div>
        </div>
      )}

      {reportFilterOpen && (
        <div className="p-4 border rounded-md shadow-sm mt-2">
          <h3 className="text-sm font-medium mb-2">Filter by Report</h3>
          <FilterInput
            placeholder="Search reports..."
            value={reportSearchQuery}
            onChange={setReportSearchQuery}
            className="mb-2"
          />
          <div className="max-h-48 overflow-y-auto">
            {reportsQuery.isPending && (
              <p className="text-sm text-muted-foreground p-2">Loading reports...</p>
            )}
            {!reportsQuery.isPending && reportsQuery.data?.body?.items?.length === 0 && (
              <p className="text-sm text-muted-foreground p-2">No reports found</p>
            )}
            {!reportsQuery.isPending &&
              reportsQuery.data?.body?.items?.map((report) => (
                <button
                  key={report.id}
                  className="flex items-center justify-between w-full text-left px-2 py-1.5 hover:bg-accent rounded-sm"
                  onClick={() => handleReportSelect(report.id, report.title)}
                >
                  <span className="truncate">{report.title}</span>
                  {report.id === selectedReportId && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </>
  );
};
