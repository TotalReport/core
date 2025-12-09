import { useState, useEffect } from 'react';
import { useUrlParams } from '@/hooks/url/use-url-params.jsx';
import { useFindTestEntities, FindTestEntitiesParams } from '@/hooks/api/test-entities/use-find-test-entities.js';
import { useFindStatuses } from '@/hooks/api/statuses/use-find-statuses.jsx';
import { useFindStatusGroups } from '@/hooks/api/status-groups/use-find-status-groups.js';
import { formatTestEntity, FormattedTestEntity, getTestTypeFromEntityType } from '@/lib/test-utils.js';
import { totalPagesCount } from '@/lib/pagination-utils.js';
import { BaseFilterData } from '@/components/common/filters/types.js';

export type SelectedTest = {
  id: number;
  type: 'test' | 'beforeTest' | 'afterTest';
};

// Type for possible view states in the left panel
export enum PanelView {
  TESTS_LIST,
  FILTERS_VIEW
}

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
  const [reportFilter, setReportFilter] = useState<{ id: number; title: string } | undefined>(() => {
    const reportId = getNumericParam('reportId');
    // Only initialize with reportId from URL, title will be resolved when filter is applied
    return reportId ? { id: reportId, title: '' } : undefined;
  });
  const [launchFilter, setLaunchFilter] = useState<{ id: number; title: string } | undefined>(() => {
    const launchId = getNumericParam('launchId');
    // Only initialize with launchId from URL, title will be resolved when filter is applied
    return launchId ? { id: launchId, title: '' } : undefined;
  });
  const [entityTypesFilter, setEntityTypesFilter] = useState<("beforeTest" | "test" | "afterTest")[]>(() => {
    const entityTypesParam = getParam('entityTypes');
    if (entityTypesParam) {
      const types = entityTypesParam.split(',') as ("beforeTest" | "test" | "afterTest")[];
      // Validate that all types are valid
      const validTypes = types.filter(type => ['beforeTest', 'test', 'afterTest'].includes(type));
      return validTypes;
    }
    return [];
  });

  // Selected test state
  const [selectedTest, setSelectedTest] = useState<SelectedTest | null>(() => {
    const testId = getNumericParam('testId');
    const beforeTestId = getNumericParam('beforeTestId');
    const afterTestId = getNumericParam('afterTestId');

    if (testId) return { id: testId, type: 'test' };
    if (beforeTestId) return { id: beforeTestId, type: 'beforeTest' };
    if (afterTestId) return { id: afterTestId, type: 'afterTest' };

    return null;
  });

  // Left panel view state (tests list or filters view)
  const [panelView, setPanelView] = useState<PanelView>(PanelView.TESTS_LIST);

  // API queries
  const testEntitiesQuery = useFindTestEntities({
    pagination: {
      offset: (page - 1) * pageSize,
      limit: pageSize,
    },
    filters: {
      titleContains: titleFilter || undefined,
      reportId: reportFilter?.id,
      launchId: launchFilter?.id,
      entityTypes: entityTypesFilter.length > 0 ? entityTypesFilter : undefined,
    },
  });

  const statusesQuery = useFindStatuses();
  const statusGroupsQuery = useFindStatusGroups();

  // Format test entities with status information
  const formattedTestEntities: FormattedTestEntity[] = 
    testEntitiesQuery.data && statusesQuery.data && statusGroupsQuery.data
      ? testEntitiesQuery.data.body.items.map(test => 
          formatTestEntity(test, statusesQuery.data.items, statusGroupsQuery.data.items)
        )
      : [];

  // Update URL params when state changes
  useEffect(() => {
    const params: Record<string, string | number | null> = {
      page,
      pageSize,
      'title~cnt': titleFilter || null,
      reportId: reportFilter?.id || null,
      launchId: launchFilter?.id || null,
      entityTypes: entityTypesFilter.length > 0 ? entityTypesFilter.join(',') : null,
      testId: null,
      beforeTestId: null,
      afterTestId: null,
    };

    if (selectedTest) {
      switch (selectedTest.type) {
        case 'test':
          params.testId = selectedTest.id;
          break;
        case 'beforeTest':
          params.beforeTestId = selectedTest.id;
          break;
        case 'afterTest':
          params.afterTestId = selectedTest.id;
          break;
      }
    }

    updateParams(params);
  }, [page, pageSize, titleFilter, reportFilter, launchFilter, entityTypesFilter, selectedTest, updateParams]);

  // Auto-adjust page when needed
  useEffect(() => {
    if (!testEntitiesQuery.isPending && testEntitiesQuery.data) {
      const totalPages = totalPagesCount(testEntitiesQuery.data.body.pagination.total, pageSize);
      if (page > totalPages && totalPages > 0) {
        setPage(totalPages);
      }
    }
  }, [testEntitiesQuery.isPending, testEntitiesQuery.data, page, pageSize]);

  // Event handlers
  const handleTestClick = (test: SelectedTest) => {
    setSelectedTest({ id: test.id, type: test.type });
  };

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, newPage));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(Math.max(1, newPageSize));
    setPage(1); // Reset to first page when page size changes
  };

  // Handler for filter button click
  const handleFilterButtonClick = () => {
    // Toggle between tests list and filters view
    if (panelView === PanelView.TESTS_LIST) {
      setPanelView(PanelView.FILTERS_VIEW);
    } else {
      // If already in a filter view, cancel and return to tests list
      setPanelView(PanelView.TESTS_LIST);
    }
  };

  // Handler for canceling all filter changes
  const handleCancelAllFilters = () => {
    // Discard changes and return to tests list
    setPanelView(PanelView.TESTS_LIST);
  };

  // Handler for applying all filter changes
  const handleApplyAllFilters = (filters: BaseFilterData) => {
    // Apply filter values to the actual filters
    setTitleFilter(filters.title || '');
    setReportFilter(filters.report);
    setLaunchFilter(filters.launch);
    setEntityTypesFilter(filters.entityTypes ? filters.entityTypes as ("beforeTest" | "test" | "afterTest")[] : []);
    
    // Return to tests list
    setPanelView(PanelView.TESTS_LIST);
    setPage(1); // Reset to first page when filters are applied
  };

  // Calculate how many filters are active
  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (titleFilter) count++;
    if (reportFilter) count++;
    if (launchFilter) count++;
    if (entityTypesFilter.length > 0) count++;
    return count;
  };

  // Get active filters count
  const activeFiltersCount = getActiveFiltersCount();

  // Get current filters data structure
  const getCurrentFilters = (): BaseFilterData => {
    return {
      title: titleFilter || undefined,
      report: reportFilter,
      launch: launchFilter,
      entityTypes: entityTypesFilter.length > 0 ? entityTypesFilter : undefined
    };
  };

  return {
    // State
    page,
    pageSize,
    titleFilter,
    reportFilter,
    launchFilter,
    entityTypesFilter,
    selectedTest,
    panelView,
    activeFiltersCount,

    // Data
    testEntitiesQuery,
    statusesQuery,
    statusGroupsQuery,
    formattedTestEntities,

    // Computed
    isLoading: testEntitiesQuery.isPending || statusesQuery.isPending || statusGroupsQuery.isPending,
    hasError: testEntitiesQuery.isError || statusesQuery.isError || statusGroupsQuery.isError,
    totalItems: testEntitiesQuery.data?.body.pagination.total || 0,

    // Handlers
    handleTestClick,
    handlePageChange,
    handlePageSizeChange,
    handleFilterButtonClick,
    handleApplyAllFilters,
    handleCancelAllFilters,
    getCurrentFilters,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
  };
}
