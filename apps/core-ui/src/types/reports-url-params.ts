export type ReportsUrlParams = {
  page: number;
  pageSize: number;
  "title~cnt": string | undefined;
  selectedReportId: number | undefined;
};

export default ReportsUrlParams;

export type ReportsUrlFilters = Omit<ReportsUrlParams, "page" | "pageSize">;

