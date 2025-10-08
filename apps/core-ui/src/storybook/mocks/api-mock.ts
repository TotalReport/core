import { contract } from "@total-report/core-contract/contract";
import type { ClientInferResponseBody } from "@ts-rest/core";
import { delay, http, HttpResponse } from "msw";

// Type-safe response types using ts-rest contract types
export type StatusResponse = ClientInferResponseBody<
  typeof contract.readTestStatus,
  200
>;
export type StatusGroupResponse = ClientInferResponseBody<
  typeof contract.readTestStatusGroup,
  200
>;

export class ApiMock {
  constructor() {}

  baseUrl = "http://localhost:3030";

  readTestStatus(statusId: string, response: StatusResponse) {
    return http.get(
      `${this.baseUrl}${contract.readTestStatus.path.replace(":id", statusId)}`,
      () => {
        return HttpResponse.json(response);
      }
    );
  }

  readTestStatusCustom(statusId: string, responseCode: number, responseBody: any) {
    return http.get(
      `${this.baseUrl}${contract.readTestStatus.path.replace(":id", statusId)}`,
      () => {
        return HttpResponse.json(responseBody, { status: responseCode });
      }
    );
  }

  readTestStatusInfinite(statusId: string) {
    return http.get(
      `${this.baseUrl}${contract.readTestStatus.path.replace(":id", statusId)}`,
      async () => {
        // Never resolve - creates endless loading state
        await delay("infinite");
        return HttpResponse.json({});
      }
    );
  }

  readTestStatusGroup(statusGroupId: string, response: StatusGroupResponse) {
    return http.get(
      `${this.baseUrl}${contract.readTestStatusGroup.path.replace(":id", statusGroupId)}`,
      () => {
        return HttpResponse.json(response);
      }
    );
  }

  readTestStatusGroupCustom(statusGroupId: string, responseCode: number, responseBody: any) {
    return http.get(
      `${this.baseUrl}${contract.readTestStatusGroup.path.replace(":id", statusGroupId)}`,
      () => {
        return HttpResponse.json(responseBody, { status: responseCode });
      }
    );
  }

  readTestStatusGroupInfinite(statusGroupId: string) {
    return http.get(
      `${this.baseUrl}${contract.readTestStatusGroup.path.replace(":id", statusGroupId)}`,
      async () => {
        // Never resolve - creates endless loading state
        await delay("infinite");
        return HttpResponse.json({});
      }
    );
  }
}
