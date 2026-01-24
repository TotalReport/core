export type LaunchesUrlParams = {
  page: number;
  pageSize: number;
  "title~cnt": string | undefined;
  selectedLaunchId: number | undefined;
};

export default LaunchesUrlParams;

export type LaunchesUrlFilters = Omit<LaunchesUrlParams, "page" | "pageSize" | "selectedLaunchId">;
