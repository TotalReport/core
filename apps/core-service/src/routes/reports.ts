import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { ReportsDAO } from "../db/reports.js";

export const createReportRoute: CreateReportRoute = async ({ body }) => {
  const response = await new ReportsDAO().createReport(body);
  return {
    status: 201,
    body: {
      id: response.id,
      title: response.title,
      createdTimestamp: response.createdTimestamp.toISOString(),
    },
  };
};

export const readReportRoute: ReadReportRoute = async ({ params: { id } }) => {
  const report = await new ReportsDAO().findReportById(id);
  if (report === undefined) {
    return {
      status: 404,
      body: {},
    };
  }
  return {
    status: 200,
    body: {
      id: report.id,
      title: report.title,
      createdTimestamp: report.createdTimestamp.toISOString(),
    },
  };
};

export const findReportsRoute: FindReportsRoute = async ({ query }) => {
  const reports = await new ReportsDAO().findReports({
    search: {
      titleContains: query["title~cnt"],
    },
    pagination: {
      limit: query.limit,
      offset: query.offset,
    },
  });
  return {
    status: 200,
    body: {
      items: reports.items.map((report) => ({
        id: report.id,
        title: report.title,
        createdTimestamp: report.createdTimestamp.toISOString(),
      })),
      pagination: reports.pagination,
    },
  };
}

export const deleteReportRoute: DeleteReportRoute = async ({ params }) => {
  await new ReportsDAO().deleteReportById(params.id);
  return {
    status: 204,
    body: undefined,
  };
};

type CreateReportRoute = AppRouteImplementation<typeof contract.createReport>;
type ReadReportRoute = AppRouteImplementation<typeof contract.readReport>;
type FindReportsRoute = AppRouteImplementation<typeof contract.findReports>;
type DeleteReportRoute = AppRouteImplementation<typeof contract.deleteReport>;
