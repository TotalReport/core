import { useState, useEffect } from 'react';
import { useUrlParams } from '@/hooks/url/use-url-params.jsx';
import { useFindTestEntities, FindTestEntitiesParams } from '@/hooks/api/test-entities/use-find-test-entities.js';
import { useFindStatuses } from '@/hooks/api/statuses/use-find-statuses.jsx';
import { useFindStatusGroups } from '@/hooks/api/status-groups/use-find-status-groups.js';
import { formatTestEntity, FormattedTestEntity, getTestTypeFromEntityType } from '@/lib/test-utils.js';
import { totalPagesCount } from '@/lib/pagination-utils.js';

export type SelectedTest = {
  id: number;
  type: 'test' | 'before-test' | 'after-test';
};

export function useTestsList() {
  const { getParam, getNumericParam, updateParams } = useUrlParams();

  // Pagination state  
  const [page, setPage] = useState(() => {
    const pageParam = getNumericParam('page');
    return pageParam && pageParam > 0 ? pageParam : 1;
  });
  const [pageSize, setPageSize] = useState(() => {
    const pageSizeParam = getNumericParam('pageSize');
    return pageSizeParam && pageSizeParam > 0 ? pageSizeParam : 10;
  });

  // Filter state
  const [titleFilter, setTitleFilter] = useState(() => getParam('title~cnt') || '');

  // Selected test state
  const [selectedTest, setSelectedTest] = useState<SelectedTest | null>(() => {
    const testId = getNumericParam('testId');
    const beforeTestId = getNumericParam('beforeTestId');
    const afterTestId = getNumericParam('afterTestId');

    if (testId) return { id: testId, type: 'test' };
    if (beforeTestId) return { id: beforeTestId, type: 'before-test' };
    if (afterTestId) return { id: afterTestId, type: 'after-test' };

    return null;
  });

  // API queries
  const testEntitiesQuery = useFindTestEntities({
    pagination: {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    },
    filters: {
      titleContains: titleFilter || undefined,
    },
  });

  const statusesQuery = useFindStatuses();
  const statusGroupsQuery = useFindStatusGroups();

  // Format test entities with status information
  const formattedTestEntities: FormattedTestEntity[] = 
    testEntitiesQuery.data && statusesQuery.data && statusGroupsQuery.data
      ? testEntitiesQuery.data.items.map(test => 
          formatTestEntity(test, statusesQuery.data.items, statusGroupsQuery.data.items)
        )
      : [];

  // Update URL params when state changes
  useEffect(() => {
    const params: Record<string, string | number | null> = {
      page,
      pageSize,
      'title~cnt': titleFilter || null,
      testId: null,
      beforeTestId: null,
      afterTestId: null,
    };

    if (selectedTest) {
      switch (selectedTest.type) {
        case 'test':
          params.testId = selectedTest.id;
          break;
        case 'before-test':
          params.beforeTestId = selectedTest.id;
          break;
        case 'after-test':
          params.afterTestId = selectedTest.id;
          break;
      }
    }

    updateParams(params);
  }, [page, pageSize, titleFilter, selectedTest, updateParams]);

  // Auto-adjust page when needed
  useEffect(() => {
    if (!testEntitiesQuery.isPending && testEntitiesQuery.data) {
      const totalPages = totalPagesCount(testEntitiesQuery.data.pagination.total, pageSize);
      if (page > totalPages && totalPages > 0) {
        setPage(totalPages);
      }
    }
  }, [testEntitiesQuery.isPending, testEntitiesQuery.data, page, pageSize]);

  // Event handlers
  const handleTestClick = (test: FormattedTestEntity) => {
    const testType = getTestTypeFromEntityType(test.entityType);
    setSelectedTest({ id: test.id, type: testType });
  };

  const handleFilterChange = (filters: { titleFilter: string }) => {
    setTitleFilter(filters.titleFilter);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, newPage));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(Math.max(1, newPageSize));
    setPage(1); // Reset to first page when page size changes
  };

  return {
    // State
    page,
    pageSize,
    titleFilter,
    selectedTest,

    // Data
    testEntitiesQuery,
    statusesQuery,
    statusGroupsQuery,
    formattedTestEntities,

    // Computed
    isLoading: testEntitiesQuery.isPending || statusesQuery.isPending || statusGroupsQuery.isPending,
    hasError: testEntitiesQuery.isError || statusesQuery.isError || statusGroupsQuery.isError,
    totalItems: testEntitiesQuery.data?.pagination.total || 0,

    // Handlers
    handleTestClick,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
  };
}
