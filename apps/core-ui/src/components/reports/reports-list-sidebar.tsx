import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { ReportsList } from "@/containers/reports-list/reports-list.jsx";

interface ReportsListSidebarProps {
  page: number;
  pageSize: number;
  titleFilter: string;
  selectedReportId: number | null;
  onReportClick: (reportId: number) => void;
  onFilterChange: (filter: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export const ReportsListSidebar: React.FC<ReportsListSidebarProps> = ({
  page,
  pageSize,
  titleFilter,
  selectedReportId,
  onReportClick,
  onFilterChange,
  setPage,
  setPageSize,
}) => {

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Reports</h2>
        <div className="flex items-center gap-2 mb-2">
          <Input
            type="text"
            placeholder="Filter by title..."
            value={titleFilter}
            onChange={handleFilterChange}
            className="flex-grow"
          />
          <Button variant="outline" onClick={() => onFilterChange("")}>
            Clear
          </Button>
        </div>
      </div>

      <ReportsList
        pagination={{ page, pageSize, setPage, setPageSize }}
        filters={{ titleContains: titleFilter }}
        selection={{ selectedId: selectedReportId, onSelect: onReportClick }}
      ></ReportsList>
    </div>
  );
};
