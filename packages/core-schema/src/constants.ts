export const TEST_STATUS_GROUPS = {
  PASSED_GROUP: {
    id: "PS",
    title: "Passed group",
    color: "#4CAF50",
  },
  FAILED_GROUP: {
    id: "FL",
    title: "Failed group",
    color: "#EF5350",
  },
  SKIPPED_GROUP: {
    id: "SK",
    title: "Skipped group",
    color: "#FF9800",
  },
};

export const DEFAULT_TEST_STATUSES = {
  PASSED: {
    id: "PS",
    title: "Passed",
    groupId: TEST_STATUS_GROUPS.PASSED_GROUP.id,
    color: "#81C784",
  },
  PASSED_WITH_WARNING: {
    id: "PW",
    title: "Passed with warning",
    groupId: TEST_STATUS_GROUPS.PASSED_GROUP.id,
    color: "#FFC107",
  },
  FAILED: {
    id: "FL",
    title: "Failed",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
    color: "#EF5350",
  },
  PRODUCT_BUG: {
    id: "PB",
    title: "Product bug",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
    color: "#E91E63",
  },
  AUTOMATION_BUG: {
    id: "AB",
    title: "Automation bug",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
    color: "#9C27B0",
  },
  SYSTEM_ISSUE: {
    id: "SI",
    title: "System issue",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
    color: "#3F51B5",
  },
  NO_DEFECT: {
    id: "ND",
    title: "No defect",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
    color: "#00BCD4",
  },
  TO_INVESTIGATE: {
    id: "TI",
    title: "To investigate",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
    color: "#607D8B",
  },
  SKIPPED: {
    id: "SK",
    title: "Skipped",
    groupId: TEST_STATUS_GROUPS.SKIPPED_GROUP.id,
    color: "#FFB74D",
  },
  ABORTED: {
    id: "AR",
    title: "Aborted",
    groupId: TEST_STATUS_GROUPS.SKIPPED_GROUP.id,
    color: "#B0BEC5",
  },
};

export const ENTITY_TYPES: {
  readonly TEST_CONTEXT: string;
  readonly BEFORE_TEST: string;
  readonly TEST: string;
  readonly AFTER_TEST: string;
} = {
  TEST_CONTEXT: "test context",
  BEFORE_TEST: "before test",
  TEST: "test",
  AFTER_TEST: "after test",
};
