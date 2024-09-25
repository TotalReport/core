import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { LaunchesDAO } from "../db/launches.js";

export const createLaunchRoute: CreateLaunchRoute = async ({ body }) => {
  let createdTimestamp = body.createdTimestamp ?? new Date();
  const launch = await new LaunchesDAO().create({ ...body, createdTimestamp });
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
    body: launch,
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
type DeleteLaunchRoute = AppRouteImplementation<typeof contract.deleteLaunch>;
type PatchLaunchRoute = AppRouteImplementation<typeof contract.patchLaunch>;
