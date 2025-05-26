export interface ReportEntity {
  id: number;
  title: string;
  createdTimestamp: string;
}

export interface ReportPagination {
  total: number;
  limit: number;
  offset: number;
}

export interface ReportsResponse {
  body: {
    items: ReportEntity[];
    pagination: ReportPagination;
  };
}

export interface TestStatusCount {
  statusId: number;
  count: number;
}

export interface TestStatus {
  id: number;
  name: string;
  statusGroupId: number;
}

export interface StatusGroup {
  id: number;
  name: string;
  color: string;
}
