import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { createLaunch, deleteLaunchById, findLaunchById } from "../db/launches.js";

export const createLaunchRoute: CreateLaunchRoute = async ({ body }) => {
  return {
    status: 201,
    body: await createLaunch(body),
  };
};

export const readLaunchRoute: ReadLaunchRoute = async ({ params }) => {
  const launch = await findLaunchById(params.id);
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

export const deleteLaunchRoute: DeleteLaunchRoute = async ({ params }) => {
  await deleteLaunchById(params.id);
  return {
    status: 204,
    body: undefined,
  };
}

type CreateLaunchRoute = AppRouteImplementation<typeof contract.createLaunch>;
type ReadLaunchRoute = AppRouteImplementation<typeof contract.readLaunch>;
type DeleteLaunchRoute = AppRouteImplementation<typeof contract.deleteLaunch>;
