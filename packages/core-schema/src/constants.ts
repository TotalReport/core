export const TEST_STATUS_GROUPS = {
  PASSED_GROUP: {
    id: "PS",
    title: "Passed group",
  },
  FAILED_GROUP: {
    id: "FL",
    title: "Failed group",
  },
  SKIPPED_GROUP: {
    id: "SK",
    title: "Skipped group",
  },
};

export const DEFAULT_TEST_STATUSES = {
  PASSED: {
    id: "PS",
    title: "Passed",
    groupId: TEST_STATUS_GROUPS.PASSED_GROUP.id,
  },
  PASSED_WITH_WARNING: {
    id: "PW",
    title: "Passed with warning",
    groupId: TEST_STATUS_GROUPS.PASSED_GROUP.id,
  },
  FAILED: {
    id: "FL",
    title: "Failed",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
  },
  PRODUCT_BUG: {
    id: "PB",
    title: "Product bug",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
  },
  AUTOMATION_BUG: {
    id: "AB",
    title: "Automation bug",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
  },
  SYSTEM_ISSUE: {
    id: "SI",
    title: "System issue",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
  },
  NO_DEFECT: {
    id: "ND",
    title: "No defect",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
  },
  TO_INVESTIGATE: {
    id: "TI",
    title: "To investigate",
    groupId: TEST_STATUS_GROUPS.FAILED_GROUP.id,
  },
  SKIPPED: {
    id: "SK",
    title: "Skipped",
    groupId: TEST_STATUS_GROUPS.SKIPPED_GROUP.id,
  },
  ABORTED: {
    id: "AR",
    title: "Aborted",
    groupId: TEST_STATUS_GROUPS.SKIPPED_GROUP.id,
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
