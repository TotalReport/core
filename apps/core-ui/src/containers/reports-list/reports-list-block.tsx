import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { ReportsList } from "@/containers/reports-list/reports-list.jsx";
import { ReportsUrlFilters } from "@/types/reports-url-params.js";
import { Filter } from "lucide-react";
import { useState } from "react";

const REPORT_FILTERS: FilterItem[] = [
  {
    id: "title",
    isFilterActive: (urlParams) => {
      return (
        urlParams?.["title~cnt"] !== undefined &&
        urlParams?.["title~cnt"] !== ""
      );
    },
    view: (value, open) => (
      <TitleContainsFilterView open={open} value={value} />
    ),
    editor: (value, apply, close) => (
      <TitleContainsFilterEditor value={value} apply={apply} close={close} />
    ),
  },
];

export const ReportsListBlock: React.FC<ReportsListBlockProps> = ({
  pagination: { page, pageSize, setPage, setPageSize },
  selection: { selectedId: selectedReportId, onSelect: onReportClick },
  filters,
  onFiltersChange,
}) => {
  const [panelView, setPanelView] = useState<PanelView>(PanelView.REPORTS_LIST);
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const handleFilterButtonClick = () => {
    if (panelView === PanelView.REPORTS_LIST) {
      setPanelView(PanelView.FILTERS_VIEW);
    } else {
      setPanelView(PanelView.REPORTS_LIST);
    }
  };

  const activeFiltersCount = REPORT_FILTERS.reduce((count, f) => {
    const v = f.isFilterActive(filters);
    return count + (v ? 1 : 0);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h1 className="text-xl font-semibold">Reports</h1>
        <Button
          variant={panelView !== PanelView.REPORTS_LIST ? "default" : "outline"}
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
      {panelView === PanelView.REPORTS_LIST && (
        <ReportsList
          pagination={{ page, pageSize, setPage, setPageSize }}
          filters={filters}
          selection={{ selectedId: selectedReportId, onSelect: onReportClick }}
        />
      )}

      {panelView === PanelView.FILTERS_VIEW && (
        <div className="p-4">
          <div className="space-y-3">
            {REPORT_FILTERS.map((filter) => {
              const isOpen = openFilter === filter.id;

              if (!isOpen) {
                return (
                  <div key={filter.id}>
                    {filter.view(filters, () => setOpenFilter(filter.id))}
                  </div>
                );
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

function TitleContainsFilterView({
  open,
  value,
}: {
  open: () => void;
  value: ReportsUrlFilters;
}) {
  return (
    <div
      className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors"
      onClick={open}
    >
      <h3 className="text-sm font-medium">Title</h3>
      <p className="text-xs text-muted-foreground mt-1">
        {value?.["title~cnt"] ? value["title~cnt"] : "Filter reports by title"}
      </p>
    </div>
  );
}

function TitleContainsFilterEditor({
  value,
  apply,
  close,
}: {
  value: ReportsUrlFilters;
  apply: (v: ReportsUrlFilters) => void;
  close: () => void;
}) {
  const [filterValue, setFilterValue] = useState<string>(
    value?.["title~cnt"] ? value["title~cnt"] : "",
  );
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

interface ReportsListBlockProps {
  pagination: {
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
  };
  filters: ReportsUrlFilters;
  onFiltersChange: (params: Partial<ReportsUrlFilters>) => void;
  selection: {
    selectedId: number | null;
    onSelect: (reportId: number) => void;
  };
}

enum PanelView {
  REPORTS_LIST,
  FILTERS_VIEW,
}

type FilterItem<TParams extends ReportsUrlFilters = ReportsUrlFilters> = {
  id: string;
  isFilterActive: (urlParams?: TParams) => boolean;
  view: (filters: TParams, openEditor: () => void) => React.ReactNode;
  editor: (
    filters: TParams,
    apply: (v: TParams) => void,
    close: () => void,
  ) => React.ReactNode;
};
