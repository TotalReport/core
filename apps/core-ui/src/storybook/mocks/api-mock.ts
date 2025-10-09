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

export type TestStepsResponse = ClientInferResponseBody<
  typeof contract.findTestSteps,
  200
>;

export type BeforeTestStepsResponse = ClientInferResponseBody<
  typeof contract.findBeforeTestSteps,
  200
>;

export type AfterTestStepsResponse = ClientInferResponseBody<
  typeof contract.findAfterTestSteps,
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

  readTestStatusCustom(
    statusId: string,
    responseCode: number,
    responseBody: any
  ) {
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

  readTestStatusGroupCustom(
    statusGroupId: string,
    responseCode: number,
    responseBody: any
  ) {
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

  findBeforeTestSteps(beforeTestId: number, response: BeforeTestStepsResponse) {
    // The API expects beforeTestId as a query parameter, not a path param
    const url = `${this.baseUrl}${contract.findBeforeTestSteps.path}?beforeTestId=${beforeTestId}`;
    return http.get(url, () => {
      return HttpResponse.json(response);
    });
  }

  findBeforeTestStepsCustom(
    beforeTestId: number,
    responseCode: number,
    responseBody: any
  ) {
    const url = `${this.baseUrl}${contract.findBeforeTestSteps.path}?beforeTestId=${beforeTestId}`;
    return http.get(url, () => {
      return HttpResponse.json(responseBody, { status: responseCode });
    });
  }

  findBeforeTestStepsInfinite(beforeTestId: number) {
    const url = `${this.baseUrl}${contract.findBeforeTestSteps.path}?beforeTestId=${beforeTestId}`;
    return http.get(url, async () => {
      await delay("infinite");
      return HttpResponse.json({});
    });
  }

  findTestSteps(testId: number, response: TestStepsResponse) {
    const url = `${this.baseUrl}${contract.findTestSteps.path}?testId=${testId}`;
    return http.get(url, () => {
      return HttpResponse.json(response);
    });
  }

  findTestStepsCustom(testId: number, responseCode: number, responseBody: any) {
    const url = `${this.baseUrl}${contract.findTestSteps.path}?testId=${testId}`;
    return http.get(url, () => {
      return HttpResponse.json(responseBody, { status: responseCode });
    });
  }

  findTestStepsInfinite(testId: number) {
    const url = `${this.baseUrl}${contract.findTestSteps.path}?testId=${testId}`;
    return http.get(url, async () => {
      await delay("infinite");
      return HttpResponse.json({});
    });
  }

  findAfterTestSteps(afterTestId: number, response: AfterTestStepsResponse) {
    const url = `${this.baseUrl}${contract.findAfterTestSteps.path}?afterTestId=${afterTestId}`;
    return http.get(url, () => {
      return HttpResponse.json(response);
    });
  }

  findAfterTestStepsCustom(
    afterTestId: number,
    responseCode: number,
    responseBody: any
  ) {
    const url = `${this.baseUrl}${contract.findAfterTestSteps.path}?afterTestId=${afterTestId}`;
    return http.get(url, () => {
      return HttpResponse.json(responseBody, { status: responseCode });
    });
  }

  findAfterTestStepsInfinite(afterTestId: number) {
    const url = `${this.baseUrl}${contract.findAfterTestSteps.path}?afterTestId=${afterTestId}`;
    return http.get(url, async () => {
      await delay("infinite");
      return HttpResponse.json({});
    });
  }
}
