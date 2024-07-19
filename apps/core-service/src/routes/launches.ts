import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { createLaunch } from "../db/launches.js";

export const createLaunchRoute: CreateLaunchRoute = async ({ body }) => {
  return {
    status: 201,
    body: await createLaunch(body),
  };
};

type CreateLaunchRoute = AppRouteImplementation<typeof contract.createLaunch>;