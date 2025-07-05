import { FormattedTestEntity } from '@/lib/test-utils.js';
import { FindTestEntitiesResponse } from '@/hooks/api/test-entities/use-find-test-entities.js';
import { TestListItem } from './test-list-item.jsx';
import { TestFilter, TestFilters } from './test-filter.jsx';
import { PaginationBlock } from '@/components/ui/pagination-block.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.js';
import { Separator } from '@/components/ui/separator.js';

type TestsListSidebarProps = {
  page: number;
  pageSize: number;
  titleFilter: string;
  testEntitiesQuery: FindTestEntitiesResponse;
  formattedTestEntities: FormattedTestEntity[];
  selectedTestId: number | null;
  selectedTestType: string | null;
  onTestClick: (test: FormattedTestEntity) => void;
  onFilterChange: (filters: TestFilters) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
};

export const TestsListSidebar = ({
  page,
  pageSize,
  titleFilter,
  testEntitiesQuery,
  formattedTestEntities,
  selectedTestId,
  selectedTestType,
  onTestClick,
  onFilterChange,
  setPage,
  setPageSize,
}: TestsListSidebarProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2">
        <h1 className="text-xl font-bold">Tests</h1>
      </div>
      
      <div className="px-4 pb-2">
        <TestFilter
          onFilterChange={onFilterChange}
          initialFilters={{ titleFilter }}
        />
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 overflow-hidden">
        {testEntitiesQuery.isPending && (
          <p className="p-4">Loading tests...</p>
        )}
        
        {!testEntitiesQuery.isPending &&
          formattedTestEntities.length === 0 && (
            <div className="flex items-center justify-center flex-grow py-8">
              <div className="text-center">
                <p className="text-lg font-bold text-secondary-foreground">
                  No tests found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting filters
                </p>
              </div>
            </div>
          )}
        
        {!testEntitiesQuery.isPending &&
          formattedTestEntities.length > 0 && (
            <div className="flex flex-col gap-2 p-2">
              {formattedTestEntities.map((test) => (
                <TestListItem
                  key={`${test.id}-${test.entityType}`}
                  test={test}
                  selected={
                    test.id === selectedTestId &&
                    test.entityType === selectedTestType
                  }
                  onClick={() => onTestClick(test)}
                />
              ))}
            </div>
          )}
      </ScrollArea>
      
      {testEntitiesQuery.data && (
        <PaginationBlock
          page={page}
          pageSize={pageSize}
          totalItems={testEntitiesQuery.data.pagination.total}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      )}
    </div>
  );
};
