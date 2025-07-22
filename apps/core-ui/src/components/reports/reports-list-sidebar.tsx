/**
 * Component that displays a sidebar with filtering and pagination for reports
 */

import { Button } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { PaginationBlock } from '@/components/ui/pagination-block.jsx';
import { FindReportsResponse } from '@/hooks/api/reports/use-find-reports.js';
import { ReportListItem } from './report-list-item.jsx';
import { ReportEntity } from '@/hooks/api/reports/use-find-report.js';

interface ReportsListSidebarProps {
  page: number;
  pageSize: number;
  titleFilter: string;
  selectedReportId: number | null;
  reportsQuery: FindReportsResponse;
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
  reportsQuery,
  onReportClick,
  onFilterChange,
  setPage,
  setPageSize,
}) => {
  const { data, isPending, isError } = reportsQuery;
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value);
  };

  const reports = data?.items || [];
  const total = data?.pagination?.total || 0;

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
          <Button variant="outline" onClick={() => onFilterChange('')}>
            Clear
          </Button>
        </div>
      </div>

      <div className="flex-grow overflow-auto">
        {isPending ? (
          <div className="p-4 text-center">Loading reports...</div>
        ) : isError ? (
          <div className="p-4 text-center text-red-500">
            Error loading reports. Please try again.
          </div>
        ) : reports.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No reports found. Try changing your filters.
          </div>
        ) : (
          <div className="divide-y">
            {reports.map((report: ReportEntity) => (
              <ReportListItem
                key={report.id}
                report={report}
                isSelected={report.id === selectedReportId}
                onClick={() => onReportClick(report.id)}
              />
            ))}
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="border-t">
          <PaginationBlock
            totalItems={total}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />
        </div>
      )}
    </div>
  );
};
