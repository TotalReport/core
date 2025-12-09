import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input.js";
import {
  ReportEntity,
  useFindReports,
} from "@/hooks/api/reports/use-find-reports.js";
import { Button } from "@/components/ui/button.js";
import { ScrollArea } from "@/components/ui/scroll-area.js";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils.js";

interface ReportFilterProps {
  selected: { id: number; title: string } | null;
  onReportSelect: (reportId: number | null, reportTitle: string) => void;
  onSearch: (query: string | undefined) => void;
}

export default function ReportFilter({
  selected,
  onReportSelect,
  onSearch,
}: ReportFilterProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchQuery || undefined);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery, onSearch]);

  // Handle selecting a report
  const handleReportClick = (report: ReportEntity) => {
    onReportSelect(report.id, report.title);
  };

  // Handle clearing selection
  const handleClearSelection = () => {
    onReportSelect(null, "");
  };

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Selected report */}
      {selected && (
        <div className="mb-4">
          <div className="flex items-center justify-between p-2 border rounded-md bg-accent">
            <div>
              <p className="text-sm font-medium">{selected.title}</p>
              <p className="text-xs text-muted-foreground">ID: {selected.id}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClearSelection}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Reports list */}
      <ReportsListBlock
        filters={{
          titleContains: searchQuery,
        }}
        selectedId={selected?.id ?? null}
        onSelect={handleReportClick}
      />
    </div>
  );
}

type ReportsListBlockProps = {
  filters: {
    titleContains?: string;
  };
  selectedId: number | null;
  onSelect: (report: ReportEntity) => void;
};

const ReportsListBlock = (params: ReportsListBlockProps) => {
  const queryResponse = useCallback(
    () =>
      useFindReports({
        filters: params.filters,
        pagination: {
          offset: 0,
          limit: 10,
        },
      }),
    [params.filters]
  )();

  if (queryResponse.isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Loading reports...</p>
      </div>
    );
  }

  if (queryResponse.isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Error loading reports</p>
      </div>
    );
  }

  return (
    <ScrollArea >
      <div className="space-y-1 p-2">
        {queryResponse.data.body.items.map((report) => {
          const isSelected = params.selectedId === report.id;
          return (
            <button
              key={report.id}
              className={cn(
                "flex w-full items-center justify-between rounded-md border p-2 text-left text-sm",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:bg-accent"
              )}
              onClick={() => params.onSelect(report)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{report.title}</span>
                <span className="text-xs text-muted-foreground">
                  ID: {report.id}
                </span>
              </div>
              {isSelected && <Check className="h-4 w-4 text-primary" />}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};
