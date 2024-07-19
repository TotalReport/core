import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { createReport, findReportById } from "../db/reports.js";

export const createReportRoute: CreateReportRoute = async ({ body }) => {
  return {
    status: 201,
    body: await createReport(body),
  };
};

export const readReportRoute: ReadReportRoute = async ({ params }) => {
  const report = await findReportById(params.id);
  if (report === undefined) {
    return {
      status: 404,
      body: {},
    };
  }
  return {
    status: 200,
    body: report,
  };
};


type CreateReportRoute = AppRouteImplementation<typeof contract.createReport>;
type ReadReportRoute = AppRouteImplementation<typeof contract.readReport>;
