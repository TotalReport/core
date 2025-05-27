import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { LaunchesDAO } from "../db/launches.js";
import { TestEntitiesDAO } from "../db/test-entities.js";

import { ClientInferResponseBody } from "@ts-rest/core";
import { ENTITY_TYPES } from "@total-report/core-schema/constants";
import { MD5 } from "object-hash";

export const createLaunchRoute: CreateLaunchRoute = async ({ body }) => {
  let createdTimestamp = body.createdTimestamp ?? new Date();
  let correlationId = body.correlationId ?? MD5(body.title);
  let argumentsHash = body.argumentsHash ?? MD5(body.arguments ?? null);

  const launch = await new LaunchesDAO().create({
    ...body,
    createdTimestamp,
    correlationId,
    argumentsHash,
  });
  return {
    status: 201,
    body: {
      ...launch,
      createdTimestamp: launch.createdTimestamp.toISOString(),
      startedTimestamp: launch.startedTimestamp?.toISOString(),
      finishedTimestamp: launch.finishedTimestamp?.toISOString(),
    },
  };
};

export const readLaunchRoute: ReadLaunchRoute = async ({ params }) => {
  const launch = await new LaunchesDAO().findById(params.id);
  if (launch === undefined) {
    return {
      status: 404,
      body: {},
    };
  }
  return {
    status: 200,
    body: {
      ...launch,
      createdTimestamp: launch.createdTimestamp.toISOString(),
      startedTimestamp: launch.startedTimestamp?.toISOString(),
      finishedTimestamp: launch.finishedTimestamp?.toISOString(),
    },
  };
};

export const findLaunchesRoute: FindLaunchRoute = async ({ query }) => {
  const data = await new LaunchesDAO().find({
    limit: query.limit,
    offset: query.offset,
    reportId: query.reportId,
    correlationId: query.correlationId,
    argumentsHash: query.argumentsHash,
    titleContains: query["title~cnt"],
  });

  return {
    status: 200,
    body: {
      items: data.items.map((item) => ({
        ...item,
        createdTimestamp: item.createdTimestamp.toISOString(),
        startedTimestamp: item.startedTimestamp?.toISOString(),
        finishedTimestamp: item.finishedTimestamp?.toISOString(),
      })),
      pagination: {
        total: data.pagination.total,
        limit: data.pagination.limit,
        offset: data.pagination.offset,
      },
    },
  };
};

export const findLaunchesCountRoute: FindLaunchesCountRoute = async ({
  query,
}) => {
  const data = await new LaunchesDAO().findCount({
    reportId: query.reportId,
    distinct: query.distinct ?? false,
  });

  return {
    status: 200,
    body: { count: data },
  };
};

export const launchStatisticsRoute: LaunchStatisticsRoute = async ({
  params,
}) => {
  const data = await new TestEntitiesDAO().statistics({
    launchId: params.id,
  });

  const responseBody = data.reduce<StatisticsResponseBody>(
    (previous, current) => {
      if (current.entityType == ENTITY_TYPES.BEFORE_TEST) {
        previous.beforeTests.push({
          statusGroupId: current.statusGroupId,
          count: current.count,
        });
      } else if (current.entityType == ENTITY_TYPES.TEST) {
        previous.tests.push({
          statusGroupId: current.statusGroupId,
          count: current.count,
        });
      } else if (current.entityType == ENTITY_TYPES.AFTER_TEST) {
        previous.afterTests.push({
          statusGroupId: current.statusGroupId,
          count: current.count,
        });
      }
      return previous;
    },
    {
      beforeTests: [],
      tests: [],
      afterTests: [],
    }
  );

  return {
    status: 200,
    body: responseBody,
  };
};

export const patchLaunchRoute: PatchLaunchRoute = async ({ params, body }) => {
  let result = await new LaunchesDAO().patch({
    ...body,
    id: params.id,
  });

  if (result === undefined) {
    return {
      status: 404,
      body: {},
    };
  }

  return {
    status: 200,
    body: {
      ...result,
      createdTimestamp: result.createdTimestamp.toISOString(),
      startedTimestamp: result.startedTimestamp?.toISOString(),
      finishedTimestamp: result.finishedTimestamp?.toISOString(),
    },
  };
};

export const deleteLaunchRoute: DeleteLaunchRoute = async ({ params }) => {
  await new LaunchesDAO().deleteById(params.id);
  return {
    status: 204,
    body: undefined,
  };
};

type CreateLaunchRoute = AppRouteImplementation<typeof contract.createLaunch>;
type ReadLaunchRoute = AppRouteImplementation<typeof contract.readLaunch>;
type FindLaunchRoute = AppRouteImplementation<typeof contract.findLaunches>;
type FindLaunchesCountRoute = AppRouteImplementation<
  typeof contract.findLaunchesCount
>;
type DeleteLaunchRoute = AppRouteImplementation<typeof contract.deleteLaunch>;
type PatchLaunchRoute = AppRouteImplementation<typeof contract.patchLaunch>;
type LaunchStatisticsRoute = AppRouteImplementation<
  typeof contract.launchStatistics
>;

type StatisticsResponseBody = ClientInferResponseBody<
  typeof contract.launchStatistics,
  200
>;
