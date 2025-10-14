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

export type TestResponse = ClientInferResponseBody<
  typeof contract.readTest,
  200
>;
export type BeforeTestResponse = ClientInferResponseBody<
  typeof contract.readBeforeTest,
  200
>;

export type AfterTestResponse = ClientInferResponseBody<
  typeof contract.readAfterTest,
  200
>;

export type TestEntitiesCountsByStatusesResponse = ClientInferResponseBody<
  typeof contract.findTestEntitiesCountsByStatuses,
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

  findTestEntitiesCountsByStatuses(
    filters:
      | { distinct?: boolean; reportId?: number; launchId?: number }
      | undefined,
    response: TestEntitiesCountsByStatusesResponse
  ) {
    const distinct = filters?.distinct ?? false;
    const reportId = filters?.reportId;
    const launchId = filters?.launchId;
    const qs = `?distinct=${distinct}${reportId !== undefined ? `&reportId=${reportId}` : ""}${launchId !== undefined ? `&launchId=${launchId}` : ""}`;
    const url = `${this.baseUrl}${contract.findTestEntitiesCountsByStatuses.path}${qs}`;
    return http.get(url, () => {
      return HttpResponse.json(response);
    });
  }

  findTestEntitiesCountsByStatusesCustom(
    filters:
      | { distinct?: boolean; reportId?: number; launchId?: number }
      | undefined,
    responseCode: number,
    responseBody: any
  ) {
    const distinct = filters?.distinct ?? false;
    const reportId = filters?.reportId;
    const launchId = filters?.launchId;
    const qs = `?distinct=${distinct}${reportId !== undefined ? `&reportId=${reportId}` : ""}${launchId !== undefined ? `&launchId=${launchId}` : ""}`;
    const url = `${this.baseUrl}${contract.findTestEntitiesCountsByStatuses.path}${qs}`;
    return http.get(url, () => {
      return HttpResponse.json(responseBody, { status: responseCode });
    });
  }

  findTestEntitiesCountsByStatusesInfinite(
    filters:
      | { distinct?: boolean; reportId?: number; launchId?: number }
      | undefined
  ) {
    const distinct = filters?.distinct ?? false;
    const reportId = filters?.reportId;
    const launchId = filters?.launchId;
    const qs = `?distinct=${distinct}${reportId !== undefined ? `&reportId=${reportId}` : ""}${launchId !== undefined ? `&launchId=${launchId}` : ""}`;
    const url = `${this.baseUrl}${contract.findTestEntitiesCountsByStatuses.path}${qs}`;
    return http.get(url, async () => {
      await delay("infinite");
      return HttpResponse.json({});
    });
  }

  readTest(testId: number, response: TestResponse) {
    return http.get(
      `${this.baseUrl}${contract.readTest.path.replace(":id", String(testId))}`,
      () => {
        return HttpResponse.json(response);
      }
    );
  }

  readTestCustom(testId: number, responseCode: number, responseBody: any) {
    return http.get(
      `${this.baseUrl}${contract.readTest.path.replace(":id", String(testId))}`,
      () => {
        return HttpResponse.json(responseBody, { status: responseCode });
      }
    );
  }

  readTestInfinite(testId: number) {
    return http.get(
      `${this.baseUrl}${contract.readTest.path.replace(":id", String(testId))}`,
      async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }
    );
  }

  readBeforeTest(beforeTestId: number, response: BeforeTestResponse) {
    return http.get(
      `${this.baseUrl}${contract.readBeforeTest.path.replace(":id", String(beforeTestId))}`,
      () => {
        return HttpResponse.json(response);
      }
    );
  }

  readBeforeTestCustom(
    beforeTestId: number,
    responseCode: number,
    responseBody: any
  ) {
    return http.get(
      `${this.baseUrl}${contract.readBeforeTest.path.replace(":id", String(beforeTestId))}`,
      () => {
        return HttpResponse.json(responseBody, { status: responseCode });
      }
    );
  }

  readBeforeTestInfinite(beforeTestId: number) {
    return http.get(
      `${this.baseUrl}${contract.readBeforeTest.path.replace(":id", String(beforeTestId))}`,
      async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }
    );
  }

  readAfterTest(afterTestId: number, response: AfterTestResponse) {
    return http.get(
      `${this.baseUrl}${contract.readAfterTest.path.replace(":id", String(afterTestId))}`,
      () => {
        return HttpResponse.json(response);
      }
    );
  }

  readAfterTestCustom(
    afterTestId: number,
    responseCode: number,
    responseBody: any
  ) {
    return http.get(
      `${this.baseUrl}${contract.readAfterTest.path.replace(":id", String(afterTestId))}`,
      () => {
        return HttpResponse.json(responseBody, { status: responseCode });
      }
    );
  }

  readAfterTestInfinite(afterTestId: number) {
    return http.get(
      `${this.baseUrl}${contract.readAfterTest.path.replace(":id", String(afterTestId))}`,
      async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }
    );
  }
}
