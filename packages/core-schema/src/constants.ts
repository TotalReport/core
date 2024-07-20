export const TEST_STATUS_GROUPS = {
  SUCCESS_GROUP: {
    id: "SS",
    title: "Success group",
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
  SUCCESS: {
    id: "SS",
    title: "Success",
    groupId: TEST_STATUS_GROUPS.SUCCESS_GROUP.id,
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
