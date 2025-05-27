/**
 * Launch entity type definition
 */
export interface LaunchEntity {
  id: number;
  title: string;
  reportId: number;
  startedTimestamp?: string | null;
  finishedTimestamp?: string | null;
  createdTimestamp: string;
  correlationId: string;
  arguments?: string;
  argumentsHash: string;
}

/**
 * Launch statistics type definition
 */
export interface LaunchStatistics {
  beforeTests: StatusCount[];
  tests: StatusCount[];
  afterTests: StatusCount[];
}

interface StatusCount {
  statusGroupId: string | null;
  count: number;
}

/**
 * Launch pagination response
 */
export interface LaunchPagination {
  items: LaunchEntity[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

/**
 * Report entity type definition
 */
export interface Report {
  id: number;
  title: string;
}

/**
 * Report pagination response
 */
export interface ReportPagination {
  items: Report[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

/**
 * Filters data structure
 */
export interface FiltersData {
  report?: {
    id: number;
    title: string;
  }
}
