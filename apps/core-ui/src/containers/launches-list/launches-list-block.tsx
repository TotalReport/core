import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { Filter, Search, Check } from "lucide-react";
import { useState } from "react";
import { LaunchesUrlFilters } from "@/types/launches-url-params.js";
import LaunchesList from "./launches-list.jsx";
import { useFindReports } from "@/hooks/api/reports/use-find-reports.js";

const LAUNCH_FILTERS: FilterItem[] = [
  {
    id: "title",
    isFilterActive: (urlParams) => {
      return urlParams?.["title~cnt"] !== undefined && urlParams?.["title~cnt"] !== "";
    },
    view: (value, open) => <TitleContainsFilterView open={open} value={value} />,
    editor: (value, apply, close) => (
      <TitleContainsFilterEditor value={value} apply={apply} close={close} />
    ),
  },
  {
    id: "report",
    isFilterActive: (urlParams) => {
      return urlParams?.reportId !== undefined && urlParams?.reportId !== null;
    },
    view: (value, open) => <ReportFilterView open={open} value={value} />,
    editor: (value, apply, close) => (
      <ReportFilterEditor value={value} apply={apply} close={close} />
    ),
  },
];

export const LaunchesListBlock: React.FC<LaunchesListBlockProps> = ({
  pagination: { page, pageSize, setPage, setPageSize },
  selection: { selectedId: selectedLaunchId, onSelect: onLaunchClick },
  filters,
  onFiltersChange,
}) => {
  const [panelView, setPanelView] = useState<PanelView>(PanelView.LAUNCHES_LIST);
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const handleFilterButtonClick = () => {
    if (panelView === PanelView.LAUNCHES_LIST) {
      setPanelView(PanelView.FILTERS_VIEW);
    } else {
      setPanelView(PanelView.LAUNCHES_LIST);
    }
  };

  const activeFiltersCount = LAUNCH_FILTERS.reduce((count, f) => {
    const v = f.isFilterActive(filters);
    return count + (v ? 1 : 0);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h1 className="text-xl font-semibold">Launches</h1>
        <Button
          variant={panelView !== PanelView.LAUNCHES_LIST ? "default" : "outline"}
          size="sm"
          onClick={handleFilterButtonClick}
        >
          <Filter className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>
      {panelView === PanelView.LAUNCHES_LIST && (
        <LaunchesList
          pagination={{ page, pageSize, setPage, setPageSize }}
          filters={filters}
          selection={{ selectedId: selectedLaunchId ?? undefined, onSelect: onLaunchClick }}
        />
      )}

      {panelView === PanelView.FILTERS_VIEW && (
        <div className="p-4">
          <div className="space-y-3">
            {LAUNCH_FILTERS.map((filter) => {
              const isOpen = openFilter === filter.id;

              if (!isOpen) {
                return <div key={filter.id}>{filter.view(filters, () => setOpenFilter(filter.id))}</div>;
              }

              return (
                <div key={filter.id}>
                  {filter.editor(
                    filters,
                    (v) => {
                      onFiltersChange?.(v);
                      setOpenFilter(null);
                    },
                    () => setOpenFilter(null),
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

function NameContainsFilterView({
  open,
  value,
}: {
  open: () => void;
  value: LaunchesUrlFilters;
}) {
  return (
    <div
      className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors"
      onClick={open}
    >
      <h3 className="text-sm font-medium">Name</h3>
      <p className="text-xs text-muted-foreground mt-1">
        {value?.["title~cnt"] ? value["title~cnt"] : "Filter launches by name"}
      </p>
    </div>
  );
}

function NameContainsFilterEditor({
  value,
  apply,
  close,
}: {
  value: LaunchesUrlFilters;
  apply: (v: LaunchesUrlFilters) => void;
  close: () => void;
}) {
  const [filterValue, setFilterValue] = useState<string>(value?.["title~cnt"] ? value["title~cnt"] : "");
  const onApply = () => {
    apply({ ...value, "title~cnt": filterValue || undefined });
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="text"
          placeholder={`Filter by name...`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="flex-grow"
        />
      </div>
      <div className="flex justify-end mt-2 gap-2">
        <Button variant="outline" onClick={close}>
          Close
        </Button>
        <Button variant="outline" onClick={() => setFilterValue("")}>
          Clear
        </Button>
        <Button variant="default" onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}

function TitleContainsFilterView({
  open,
  value,
}: {
  open: () => void;
  value: LaunchesUrlFilters;
}) {
  return (
    <div
      className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors"
      onClick={open}
    >
      <h3 className="text-sm font-medium">Title</h3>
      <p className="text-xs text-muted-foreground mt-1">
        {value?.["title~cnt"] ? value["title~cnt"] : "Filter launches by title"}
      </p>
    </div>
  );
}

function TitleContainsFilterEditor({
  value,
  apply,
  close,
}: {
  value: LaunchesUrlFilters;
  apply: (v: LaunchesUrlFilters) => void;
  close: () => void;
}) {
  const [filterValue, setFilterValue] = useState<string>(value?.["title~cnt"] ? value["title~cnt"] : "");
  const onApply = () => {
    apply({ ...value, "title~cnt": filterValue || undefined });
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="text"
          placeholder={`Filter by title...`}
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
          className="flex-grow"
        />
      </div>
      <div className="flex justify-end mt-2 gap-2">
        <Button variant="outline" onClick={close}>
          Close
        </Button>
        <Button variant="outline" onClick={() => setFilterValue("")}>
          Clear
        </Button>
        <Button variant="default" onClick={onApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}

function ReportFilterView({
  open,
  value,
}: {
  open: () => void;
  value: LaunchesUrlFilters;
}) {
  return (
    <div
      className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors"
      onClick={open}
    >
      <h3 className="text-sm font-medium">Report</h3>
      <p className="text-xs text-muted-foreground mt-1">
        {value?.reportId ? `Report ID: ${value.reportId}` : "Filter launches by report"}
      </p>
    </div>
  );
}

function ReportFilterEditor({
  value,
  apply,
  close,
}: {
  value: LaunchesUrlFilters;
  apply: (v: LaunchesUrlFilters) => void;
  close: () => void;
}) {
  const [selectedReport, setSelectedReport] = useState<{ id: number; title: string } | undefined>(
    value?.reportId ? { id: value.reportId, title: "" } : undefined
  );
  const [searchTerm, setSearchTerm] = useState("");

  const reportsQuery = useFindReports({
    pagination: { offset: 0, limit: 50 },
    filters: { "title~cnt": searchTerm || undefined },
  });

  const handleSelectReport = (report: { id: number; title: string }) => {
    setSelectedReport(report);
  };

  const handleClearSelection = () => {
    setSelectedReport(undefined);
  };

  const handleApply = () => {
    const next = selectedReport ? { ...value, reportId: selectedReport.id } : { ...value, reportId: undefined };
    apply(next as LaunchesUrlFilters);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-0">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {selectedReport && (
          <div className="p-3 border rounded-md bg-accent/30 border-primary mt-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Selected Report</p>
                <p className="text-xs text-muted-foreground">{selectedReport.title}</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={handleClearSelection}>
                Clear
              </Button>
            </div>
          </div>
        )}

        <div className="max-h-60 overflow-y-auto space-y-2 mt-3">
          {reportsQuery.isPending && (
            <div className="text-center text-muted-foreground text-sm py-4">Loading reports...</div>
          )}

          {reportsQuery.isError && (
            <div className="text-center text-destructive text-sm py-4">Error loading reports</div>
          )}

          {reportsQuery.data?.body.items.map((report) => (
            <div
              key={report.id}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedReport?.id === report.id ? "border-primary bg-accent/30" : "hover:bg-accent"
              }`}
              onClick={() => handleSelectReport({ id: report.id, title: report.title })}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{report.title}</p>
                {selectedReport?.id === report.id && <Check className="h-4 w-4 text-primary" />}
              </div>
            </div>
          ))}

          {reportsQuery.data?.body.items.length === 0 && !reportsQuery.isPending && (
            <div className="text-center text-muted-foreground text-sm py-4">No reports found</div>
          )}
        </div>
      </div>

      <div className="mt-auto p-4 border-t flex justify-end gap-2">
        <Button variant="outline" onClick={close}>
          Cancel
        </Button>
        <Button onClick={handleApply}>Apply</Button>
      </div>
    </div>
  );
}

interface LaunchesListBlockProps {
  pagination: {
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
  };
  filters: LaunchesUrlFilters;
  onFiltersChange: (params: Partial<LaunchesUrlFilters>) => void;
  selection: {
    selectedId: number | null;
    onSelect: (launchId: number) => void;
  };
}

enum PanelView {
  LAUNCHES_LIST,
  FILTERS_VIEW,
}

type FilterItem<TParams extends LaunchesUrlFilters = LaunchesUrlFilters> = {
  id: string;
  isFilterActive: (urlParams?: TParams) => boolean;
  view: (filters: TParams, openEditor: () => void) => React.ReactNode;
  editor: (
    filters: TParams,
    apply: (v: TParams) => void,
    close: () => void,
  ) => React.ReactNode;
};
