import { contract } from "@total-report/core-contract/contract";
import { initClient } from "@ts-rest/core";

const port = process.env["CORE_SERVICE_PORT"];
const baseUrl = `http://localhost:${port}`;

const createClient = (token?: string) =>
  initClient(contract, {
    baseUrl,
    baseHeaders: token ? { Authorization: `Bearer ${token}` } : {},
  });

/** Client for public routes (register, login, healthcheck, etc.). */
export const publicClient = createClient();

/** Client authenticated with a specific access token. */
export const authenticatedClient = (token: string) => createClient(token);
