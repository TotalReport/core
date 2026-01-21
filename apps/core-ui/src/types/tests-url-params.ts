export type TestsUrlParams = {
  page: number;
  pageSize: number;
  "title~cnt": string | undefined;
  reportId: number | undefined;
  launchId: number | undefined;
  entityTypes: string | undefined; // comma-separated list in URL
  testId: number | undefined;
  beforeTestId: number | undefined;
  afterTestId: number | undefined;
};

export default TestsUrlParams;

export type TestsUrlFilters = Omit<TestsUrlParams, "page" | "pageSize" | "testId" | "beforeTestId" | "afterTestId"> & {
  entityTypes?: ("beforeTest" | "test" | "afterTest")[] | undefined;
};
