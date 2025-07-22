/**
 * Hook for managing the reports list state and business logic
 */

import { useLocation, useNavigate } from "@modern-js/runtime/router";
import { useCallback, useEffect, useState } from "react";
import { useFindReports } from "./api/reports/use-find-reports.js";

export const useReportsList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // Get initial values from URL
  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? Math.max(1, parseInt(pageParam)) : 1;
  });

  const [pageSize, setPageSize] = useState(() => {
    const pageSizeParam = searchParams.get("pageSize");
    return pageSizeParam ? Math.max(1, parseInt(pageSizeParam)) : 10;
  });

  const [titleFilter, setTitleFilter] = useState(
    () => searchParams.get("title~cnt") || ""
  );

  // Track selected report ID
  const [selectedReportId, setSelectedReportId] = useState<number | null>(
    () => {
      const reportId = searchParams.get("selectedReportId");
      return reportId ? parseInt(reportId) : null;
    }
  );

  // Fetch reports data
  const reportsQuery = useFindReports({
    pagination: {
      limit: pageSize,
      offset: (page - 1) * pageSize,
    },
    filters: {
      titleContains: titleFilter || undefined,
    },
  });

  // Update URL with current state
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();

    // Only add params that have values
    params.set("page", page.toString());
    params.set("pageSize", pageSize.toString());

    if (titleFilter) {
      params.set("title~cnt", titleFilter);
    }

    if (selectedReportId !== null) {
      params.set("selectedReportId", selectedReportId.toString());
    }

    navigate(
      {
        pathname: location.pathname,
        search: params.toString(),
      },
      { replace: true }
    );
  }, [
    page,
    pageSize,
    titleFilter,
    selectedReportId,
    navigate,
    location.pathname,
  ]);

  // Update URL when state changes
  useEffect(() => {
    updateUrl();
  }, [page, pageSize, titleFilter, selectedReportId, updateUrl]);

  // Handle report selection
  const handleReportClick = useCallback((reportId: number) => {
    setSelectedReportId(reportId);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((filterValue: string) => {
    setTitleFilter(filterValue);
    setPage(1); // Reset to first page when filter changes
  }, []);

  return {
    page,
    pageSize,
    titleFilter,
    selectedReportId,
    reportsQuery,
    handleReportClick,
    handleFilterChange,
    setPage,
    setPageSize,
  };
};
