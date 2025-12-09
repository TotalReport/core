import { ReportListItem } from "@/components/reports/report-list-item.jsx";
import { PaginationBlock } from "@/components/ui/pagination-block.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import ErrorRetry from "@/components/ui/error-retry.js";
import {
  ReportEntity,
  useFindReports
} from "@/hooks/api/reports/use-find-reports.js";

interface ReportsListSidebarProps {
  pagination: {
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
  };
  filters: {
    titleContains?: string;
  };
  selection: {
    selectedId: number | null;
    onSelect: (reportId: number) => void;
  };
}

export const ReportsList: React.FC<ReportsListSidebarProps> = ({
  pagination: { page, pageSize, setPage, setPageSize },
  filters: { titleContains },
  selection: { selectedId, onSelect },
}) => {
  const { data, isPending, isError, refetch } = useFindReports({
    pagination: { offset: (page - 1) * pageSize, limit: pageSize },
    filters: { titleContains },
    enabled: true,
  });

  const reports = data?.body?.items || [];
  const total = data?.body?.pagination?.total || 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-auto">
        {isPending && (
          <div className="flex flex-col gap-2 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-1 rounded-lg border p-3">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-32" />
                  <div className="ml-auto">
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-40" />
                </div>
                <div className="mt-2">
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isPending && isError && (
          <div className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <ErrorRetry onRetry={() => refetch()} />
            </div>
          </div>
        )}

        {!isPending && !isError && reports.length === 0 && (
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <p className="text-lg font-bold text-secondary-foreground">No reports found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting filters</p>
            </div>
          </div>
        )}

        {!isPending && !isError && reports.length > 0 && (
          <div className="divide-y">
            {reports.map((report: ReportEntity) => (
              <ReportListItem
                key={report.id}
                report={report}
                isSelected={report.id === selectedId}
                onClick={() => onSelect(report.id)}
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
