'use client';

import { ReportFilters } from '@/types/report-filters';
import { ReportEntity } from '@/types/reports';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useFindReports } from './use-find-reports';

export const useReportsList = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // Get initial values from URL
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get('page');
    return pageParam ? Math.max(1, parseInt(pageParam)) : 1;
  });
  
  const [pageSize, setPageSize] = useState(() => {
    const pageSizeParam = searchParams.get('pageSize');
    return pageSizeParam ? Math.max(1, parseInt(pageSizeParam)) : 10;
  });
  
  const [titleFilter, setTitleFilter] = useState(() => 
    searchParams.get('title~cnt') || ''
  );
  
  // Track selected report ID
  const [selectedReportId, setSelectedReportId] = useState<number | null>(() => {
    const reportId = searchParams.get('selectedReportId');
    return reportId ? parseInt(reportId) : null;
  });

  // Fetch reports data
  const reportsQuery = useFindReports(
    {
        limit: pageSize,
        offset: (page - 1) * pageSize,
        titleContains: titleFilter || undefined,
    }
  );

  // Update URL with current state
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    
    // Only add params that have values
    params.set('page', page.toString());
    params.set('pageSize', pageSize.toString());
    
    if (titleFilter) {
      params.set('title~cnt', titleFilter);
    }
    
    if (selectedReportId !== null) {
      params.set('selectedReportId', selectedReportId.toString());
    }
    
    // Replace current URL without adding to history stack
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [page, pageSize, titleFilter, selectedReportId, router, pathname]);

  // Handle pagination boundaries
  useEffect(() => {
    let shouldUpdate = false;
    
    if (page < 1) {
      setPage(1);
      shouldUpdate = true;
    }
    
    if (pageSize < 1) {
      setPageSize(10);
      shouldUpdate = true;
    }
    
    // Handle page boundaries based on total results
    if (!reportsQuery.isPending && reportsQuery.data?.body) {
      const totalPages = Math.ceil(
        reportsQuery.data.body.pagination.total / pageSize
      );

      if (page > totalPages && totalPages > 0) {
        setPage(totalPages);
        shouldUpdate = true;
      }
    }
    
    if (!shouldUpdate) {
      updateUrl();
    }
  }, [page, pageSize, reportsQuery.data, reportsQuery.isPending, updateUrl]);

  // Handler for when a report item is clicked
  const handleReportClick = useCallback((report: ReportEntity) => {
    setSelectedReportId(report.id);
  }, []);

  // Handler for filter changes
  const handleFilterChange = useCallback((filters: ReportFilters) => {
    setTitleFilter(filters.titleFilter);
    setPage(1); // Reset to first page when filters change
  }, []);

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    titleFilter,
    selectedReportId,
    reportsQuery,
    handleReportClick,
    handleFilterChange,
  };
};
