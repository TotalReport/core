import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { db } from "../db/setup.js";
import { sql } from 'drizzle-orm';

let apiStarted = false;

export const setApiStarted = (value: boolean) => {
  apiStarted = value;
};

export const healthCheckRoute: HealthCheckRoute = async () => {
  const dbAccessible = await checkDatabaseReady();
  return {
    status: apiStarted === false || dbAccessible === false ? 503 : 200,
    body: {
      apiStarted: apiStarted,
      databaseAccessible: dbAccessible,
    },
  };
};

async function checkDatabaseReady() {
  try {
    return await db.execute(sql`select 1`).then(() => true).catch(() => false);
  } catch (error) {
    return false;
  }
}

type HealthCheckRoute = AppRouteImplementation<typeof contract.healthCheck>;
