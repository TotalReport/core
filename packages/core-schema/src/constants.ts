export const TEST_STATUS_GROUPS = {
  SUCCESSFUL_GROUP: {
    id: "SL",
    title: "Successful group",
  },
  ABORTED_GROUP: {
    id: "AD",
    title: "Aborted group",
  },
  SKIPPED_GROUP: {
    id: "SD",
    title: "Skipped group",
  },
  PRODUCT_BUG_GROUP: {
    id: "PB",
    title: "Product bugs group",
  },
  AUTOMATION_BUG_GROUP: {
    id: "AB",
    title: "Automation bugs group",
  },
  SYSTEM_ISSUE_GROUP: {
    id: "SI",
    title: "System issues group",
  },
  NO_DEFECT_GROUP: {
    id: "ND",
    title: "No defect group",
  },
  TO_INVESTIGATE_GROUP: {
    id: "TI",
    title: "To investigate group",
  },
};

export const DEFAULT_TEST_STATUSES = {
  SUCCESSFUL: {
    id: "SL",
    title: "Successful",
    groupId: TEST_STATUS_GROUPS.SUCCESSFUL_GROUP.id,
  },
  ABORTED: {
    id: "AD",
    title: "Aborted",
    groupId: TEST_STATUS_GROUPS.ABORTED_GROUP.id,
  },
  SKIPPED: {
    id: "SD",
    title: "Skipped",
    groupId: TEST_STATUS_GROUPS.SKIPPED_GROUP.id,
  },
  PRODUCT_BUG: {
    id: "PB",
    title: "Product bug",
    groupId: TEST_STATUS_GROUPS.PRODUCT_BUG_GROUP.id,
  },
  AUTOMATION_BUG: {
    id: "AB",
    title: "Automation bug",
    groupId: TEST_STATUS_GROUPS.AUTOMATION_BUG_GROUP.id,
  },
  SYSTEM_ISSUE: {
    id: "SI",
    title: "System issue",
    groupId: TEST_STATUS_GROUPS.SYSTEM_ISSUE_GROUP.id,
  },
  NO_DEFECT: {
    id: "ND",
    title: "No defect",
    groupId: TEST_STATUS_GROUPS.NO_DEFECT_GROUP.id,
  },
  TO_INVESTIGATE: {
    id: "TI",
    title: "To investigate",
    groupId: TEST_STATUS_GROUPS.TO_INVESTIGATE_GROUP.id,
  },
};
