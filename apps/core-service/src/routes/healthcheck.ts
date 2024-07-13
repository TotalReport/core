import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";

let apiStarted = false;

export const setApiStarted = (value: boolean) => {
  apiStarted = value;
};

export const healthCheckRoute: HealthCheckRoute = async () => {
  return {
    status: apiStarted === false ? 503 : 200,
    body: {
      apiStarted: apiStarted,
      databaseAccessible: true,
    },
  };
};

type HealthCheckRoute = AppRouteImplementation<typeof contract.healthCheck>;
