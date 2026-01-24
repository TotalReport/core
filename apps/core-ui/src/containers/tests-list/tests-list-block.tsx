import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { useFindLaunches } from "@/hooks/api/launches/use-find-launches.js";
import { TestsUrlFilters } from "@/types/tests-url-params.js";
import { Check, Filter, Search } from "lucide-react";
import { useState } from "react";
import { TestsList } from "./tests-list.jsx";

const TEST_FILTERS: FilterItem[] = [
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
    id: "launch",
    isFilterActive: (urlParams) => {
      return urlParams?.launchId !== undefined && urlParams?.launchId !== null;
    },
    view: (value, open) => <LaunchFilterView open={open} value={value} />,
    editor: (value, apply, close) => (
      <LaunchFilterEditor value={value} apply={apply} close={close} />
    ),
  },
  {
    id: "entityTypes",
    isFilterActive: (urlParams) => {
      return urlParams?.entityTypes !== undefined && urlParams?.entityTypes?.length > 0;
    },
    view: (value, open) => <EntityTypesFilterView open={open} value={value} />,
    editor: (value, apply, close) => (
      <EntityTypesFilterEditor value={value} apply={apply} close={close} />
    ),
  },
];

export const TestsListBlock: React.FC<TestsListBlockProps> = ({
  pagination: { page, pageSize, setPage, setPageSize },
  selection: { selectedId: selectedTestId, onSelect: onTestClick },
  filters,
  onFiltersChange,
}) => {
  const [panelView, setPanelView] = useState<PanelView>(PanelView.TESTS_LIST);
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const handleFilterButtonClick = () => {
    if (panelView === PanelView.TESTS_LIST) {
      setPanelView(PanelView.FILTERS_VIEW);
    } else {
      setPanelView(PanelView.TESTS_LIST);
    }
  };

  const activeFiltersCount = TEST_FILTERS.reduce((count, f) => {
    const v = f.isFilterActive(filters);
    return count + (v ? 1 : 0);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h1 className="text-xl font-semibold">Tests</h1>
        <Button
          variant={panelView !== PanelView.TESTS_LIST ? "default" : "outline"}
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

      {panelView === PanelView.TESTS_LIST && (
        <TestsList
          pagination={{ page, pageSize, setPage, setPageSize }}
          filters={filters}
          selection={{ selectedId: selectedTestId ?? undefined, onSelect: onTestClick }}
        />
      )}

      {panelView === PanelView.FILTERS_VIEW && (
        <div className="p-4">
          <div className="space-y-3">
            {TEST_FILTERS.map((filter) => {
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

function TitleContainsFilterView({
  open,
  value,
}: {
  open: () => void;
  value: TestsUrlFilters;
}) {
  return (
    <div
      className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors"
      onClick={open}
    >
      <h3 className="text-sm font-medium">Title</h3>
      <p className="text-xs text-muted-foreground mt-1">
        {value?.["title~cnt"] ? value["title~cnt"] : "Filter tests by title"}
      </p>
    </div>
  );
}

function LaunchFilterView({
  open,
  value,
}: {
  open: () => void;
  value: TestsUrlFilters;
}) {
  return (
    <div
      className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors"
      onClick={open}
    >
      <h3 className="text-sm font-medium">Launch</h3>
      <p className="text-xs text-muted-foreground mt-1">
        {value?.launchId ? `Launch ID: ${value.launchId}` : "Filter tests by launch"}
      </p>
    </div>
  );
}

function LaunchFilterEditor({
  value,
  apply,
  close,
}: {
  value: TestsUrlFilters;
  apply: (v: TestsUrlFilters) => void;
  close: () => void;
}) {
  const [selectedLaunch, setSelectedLaunch] = useState<{ id: number; title: string } | undefined>(
    value?.launchId ? { id: value.launchId, title: "" } : undefined,
  );
  const [searchTerm, setSearchTerm] = useState("");

  const launchesQuery = useFindLaunches({
    pagination: { offset: 0, limit: 50 },
    filters: { titleContains: searchTerm || undefined },
  });

  const handleSelectLaunch = (launch: { id: number; title: string }) => setSelectedLaunch(launch);
  const handleClearSelection = () => setSelectedLaunch(undefined);

  const handleApply = () => {
    const next = selectedLaunch ? { ...value, launchId: selectedLaunch.id } : { ...value, launchId: undefined };
    apply(next as TestsUrlFilters);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-0">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search launches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        {selectedLaunch && (
          <div className="p-3 border rounded-md bg-accent/30 border-primary mt-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Selected Launch</p>
                <p className="text-xs text-muted-foreground">{selectedLaunch.title}</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={handleClearSelection}>
                Clear
              </Button>
            </div>
          </div>
        )}

        <div className="max-h-60 overflow-y-auto space-y-2 mt-3">
          {launchesQuery.isPending && (
            <div className="text-center text-muted-foreground text-sm py-4">Loading launches...</div>
          )}

          {launchesQuery.isError && (
            <div className="text-center text-destructive text-sm py-4">Error loading launches</div>
          )}

          {launchesQuery.data?.body.items.map((launch) => (
            <div
              key={launch.id}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedLaunch?.id === launch.id ? "border-primary bg-accent/30" : "hover:bg-accent"
              }`}
              onClick={() => handleSelectLaunch({ id: launch.id, title: launch.title })}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium truncate">{launch.title}</p>
                {selectedLaunch?.id === launch.id && <Check className="h-4 w-4 text-primary" />}
              </div>
            </div>
          ))}

          {launchesQuery.data?.body.items.length === 0 && !launchesQuery.isPending && (
            <div className="text-center text-muted-foreground text-sm py-4">No launches found</div>
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

function EntityTypesFilterView({
  open,
  value,
}: {
  open: () => void;
  value: TestsUrlFilters;
}) {
  const types = value?.entityTypes;
  return (
    <div
      className="border rounded-md p-4 cursor-pointer hover:bg-accent transition-colors"
      onClick={open}
    >
      <h3 className="text-sm font-medium">Entity types</h3>
      <p className="text-xs text-muted-foreground mt-1">
        {types && types.length > 0 ? types.join(", ") : "Filter tests by entity type"}
      </p>
    </div>
  );
}

function EntityTypesFilterEditor({
  value,
  apply,
  close,
}: {
  value: TestsUrlFilters;
  apply: (v: TestsUrlFilters) => void;
  close: () => void;
}) {
  const [selected, setSelected] = useState<("beforeTest" | "test" | "afterTest")[]>(
    value?.entityTypes ? value.entityTypes : [],
  );

  const toggle = (t: "beforeTest" | "test" | "afterTest") => {
    setSelected((s) => (s.includes(t) ? s.filter((x) => x !== t) : [...s, t]));
  };

  const handleApply = () => {
    apply({ ...value, entityTypes: selected.length > 0 ? selected : undefined } as TestsUrlFilters);
  };

  const handleClear = () => setSelected([]);

  return (
    <div className="mt-2">
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={selected.includes("beforeTest")} onChange={() => toggle("beforeTest")} />
          <span className="text-sm">Before Test</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={selected.includes("test")} onChange={() => toggle("test")} />
          <span className="text-sm">Test</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={selected.includes("afterTest")} onChange={() => toggle("afterTest")} />
          <span className="text-sm">After Test</span>
        </label>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        <Button variant="outline" onClick={close}>
          Close
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button variant="default" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  );
}

function TitleContainsFilterEditor({
  value,
  apply,
  close,
}: {
  value: TestsUrlFilters;
  apply: (v: TestsUrlFilters) => void;
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

export type SelectedTest = {
  id: number;
  type: 'test' | 'beforeTest' | 'afterTest';
};

interface TestsListBlockProps {
  pagination: {
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
  };
  filters: TestsUrlFilters;
  onFiltersChange: (params: Partial<TestsUrlFilters>) => void;
  selection: {
    selectedId: number | null;
    onSelect: (testId: SelectedTest) => void;
  };
}

enum PanelView {
  TESTS_LIST,
  FILTERS_VIEW,
}

type FilterItem<TParams extends TestsUrlFilters = TestsUrlFilters> = {
  id: string;
  isFilterActive: (urlParams?: TParams) => boolean;
  view: (filters: TParams, openEditor: () => void) => React.ReactNode;
  editor: (
    filters: TParams,
    apply: (v: TParams) => void,
    close: () => void,
  ) => React.ReactNode;
};

export default TestsListBlock;
