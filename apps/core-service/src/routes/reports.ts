import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { createReport, deleteReportById, findReportById } from "../db/reports.js";

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

export const deleteReportRoute: DeleteReportRoute = async ({ params }) => {
  await deleteReportById(params.id);
  return {
    status: 204,
    body: undefined,
  };
}

type CreateReportRoute = AppRouteImplementation<typeof contract.createReport>;
type ReadReportRoute = AppRouteImplementation<typeof contract.readReport>;
type DeleteReportRoute = AppRouteImplementation<typeof contract.deleteReport>;
