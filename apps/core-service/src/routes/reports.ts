import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { createReport } from "../db/reports.js";

export const createReportRoute: CreateReportRoute = async ({ body }) => {
  return {
    status: 201,
    body: await createReport(body),
  };
};

type CreateReportRoute = AppRouteImplementation<typeof contract.createReport>;
