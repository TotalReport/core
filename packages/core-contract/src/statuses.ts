import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const TestStatusGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdTimestamp: z.string().datetime({ offset: true }),
  color: z.string(),
});

export const TestStatusSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdTimestamp: z.string().datetime({ offset: true }),
  groupId: z.string(),
  color: z.string(),
});

const contract = initContract();

export const findTestStatusGroups = contract.query({
  summary: "Find all test status groups.",
  method: "GET",
  path: "/v1/test-status-groups",
  responses: {
    200: z.object({
      items: z.array(TestStatusGroupSchema),
    }),
  },
});

export const findTestStatuses = contract.query({
  summary: "Find all test statuses.",
  method: "GET",
  path: "/v1/test-statuses",
  responses: {
    200: z.object({
      items: z.array(TestStatusSchema),
    }),
  },
});

export const readTestStatusGroup = contract.query({
  summary: "Read the test status group by ID.",
  method: "GET",
  path: "/v1/test-status-groups/:id",
  pathParams: z.object({
    id: z.string(),
  }),
  responses: {
    200: TestStatusGroupSchema,
    404: z.object({}),
  },
});

export const readTestStatus = contract.query({
  summary: "Read the test status by ID.",
  method: "GET",
  path: "/v1/test-statuses/:id",
  pathParams: z.object({
    id: z.string(),
  }),
  responses: {
    200: TestStatusSchema,
    404: z.object({}),
  },
});
