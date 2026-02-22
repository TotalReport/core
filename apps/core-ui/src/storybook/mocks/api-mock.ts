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

export type TestResponse = ClientInferResponseBody<
  typeof contract.readTest,
  200
>;

export type TestEntitiesCountsByStatusesResponse = ClientInferResponseBody<
  typeof contract.findTestEntitiesCountsByStatuses,
  200
>;

export type LaunchResponse = ClientInferResponseBody<
  typeof contract.readLaunch,
  200
>;

export type FindLaunchesResponse = ClientInferResponseBody<
  typeof contract.findLaunches,
  200
>;

export type LaunchesCountResponse = ClientInferResponseBody<
  typeof contract.findLaunchesCount,
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

  findTestEntitiesCountsByStatuses(
    filters:
      | { distinct?: boolean; launchId?: number }
      | undefined,
    response: TestEntitiesCountsByStatusesResponse
  ) {
    const distinct = filters?.distinct ?? false;
    const launchId = filters?.launchId;
    const qs = `?distinct=${distinct}${launchId !== undefined ? `&launchId=${launchId}` : ""}`;
    const url = `${this.baseUrl}${contract.findTestEntitiesCountsByStatuses.path}${qs}`;
    return http.get(url, () => {
      return HttpResponse.json(response);
    });
  }

  findTestEntitiesCountsByStatusesCustom(
    filters:
      | { distinct?: boolean; launchId?: number }
      | undefined,
    responseCode: number,
    responseBody: any
  ) {
    const distinct = filters?.distinct ?? false;
    const launchId = filters?.launchId;
    const qs = `?distinct=${distinct}${launchId !== undefined ? `&launchId=${launchId}` : ""}`;
    const url = `${this.baseUrl}${contract.findTestEntitiesCountsByStatuses.path}${qs}`;
    return http.get(url, () => {
      return HttpResponse.json(responseBody, { status: responseCode });
    });
  }

  findTestEntitiesCountsByStatusesInfinite(
    filters:
      | { distinct?: boolean; launchId?: number }
      | undefined
  ) {
    const distinct = filters?.distinct ?? false;
    const launchId = filters?.launchId;
    const qs = `?distinct=${distinct}${launchId !== undefined ? `&launchId=${launchId}` : ""}`;
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

  readLaunch(launchId: number, response: LaunchResponse) {
    return http.get(
      `${this.baseUrl}${contract.readLaunch.path.replace(":id", String(launchId))}`,
      () => {
        return HttpResponse.json(response);
      }
    );
  }

  readLaunchCustom(launchId: number, responseCode: number, responseBody: any) {
    return http.get(
      `${this.baseUrl}${contract.readLaunch.path.replace(":id", String(launchId))}`,
      () => {
        return HttpResponse.json(responseBody, { status: responseCode });
      }
    );
  }

  readLaunchInfinite(launchId: number) {
    return http.get(
      `${this.baseUrl}${contract.readLaunch.path.replace(":id", String(launchId))}`,
      async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }
    );
  }

  findLaunchesCount(
    filters: { },
    response: LaunchesCountResponse
  ) {
    return http.get(
      `${this.baseUrl}${contract.findLaunchesCount.path}`,
      () => {
        return HttpResponse.json(response);
      }
    );
  }

  findLaunches(
    filters:
      | { limit?: number; offset?: number; "title~cnt"?: string }
      | undefined,
    response: FindLaunchesResponse
  ) {
    const limit = filters?.limit ?? 25;
    const offset = filters?.offset ?? 0;
    const title = filters?.["title~cnt"];
    const qs = `?limit=${limit}&offset=${offset}${title !== undefined ? `&title~cnt=${encodeURIComponent(title)}` : ``}`;
    const url = `${this.baseUrl}${contract.findLaunches.path}${qs}`;
    return http.get(url, () => {
      return HttpResponse.json(response);
    });
  }

  findLaunchesInfinite(filters: { limit?: number; offset?: number; "title~cnt"?: string }) {
    const limit = filters?.limit ?? 25;
    const offset = filters?.offset ?? 0;
    const title = filters?.["title~cnt"];
    const qs = `?limit=${limit}&offset=${offset}${title !== undefined ? `&title~cnt=${encodeURIComponent(title)}` : ``}`;
    const url = `${this.baseUrl}${contract.findLaunches.path}${qs}`;
    return http.get(url, async () => {
      await delay("infinite");
      return HttpResponse.json({});
    });
  }

  findLaunchesCustom(
    filters:
      | { limit?: number; offset?: number; "title~cnt"?: string }
      | undefined,
    responseCode: number,
    responseBody: any
  ) {
    const limit = filters?.limit ?? 25;
    const offset = filters?.offset ?? 0;
    const title = filters?.["title~cnt"];
    const qs = `?limit=${limit}&offset=${offset}${title !== undefined ? `&title~cnt=${encodeURIComponent(title)}` : ``}`;
    const url = `${this.baseUrl}${contract.findLaunches.path}${qs}`;
    return http.get(url, () => {
      return HttpResponse.json(responseBody, { status: responseCode });
    });
  }

  findTestEntities(
    filters:
      | { limit?: number; offset?: number; launchId?: number; "title~cnt"?: string }
      | undefined,
    response: FindTestsResponseData
  ) {
    const limit = filters?.limit ?? 25;
    const offset = filters?.offset ?? 0;
    const launchId = filters?.launchId;
    const title = filters?.["title~cnt"];
    const qs = `?limit=${limit}&offset=${offset}${launchId !== undefined ? `&launchId=${launchId}` : ``}${title !== undefined ? `&title~cnt=${encodeURIComponent(title)}` : ``}`;
    const url = `${this.baseUrl}${contract.findTests.path}${qs}`;
    return http.get(url, () => {
      return HttpResponse.json(response);
    });
  }

  findTestEntitiesInfinite(filters: { limit?: number; offset?: number; launchId?: number; "title~cnt"?: string }) {
    const limit = filters?.limit ?? 25;
    const offset = filters?.offset ?? 0;
    const launchId = filters?.launchId;
    const title = filters?.["title~cnt"];
    const qs = `?limit=${limit}&offset=${offset}${launchId !== undefined ? `&launchId=${launchId}` : ``}${title !== undefined ? `&title~cnt=${encodeURIComponent(title)}` : ``}`;
    const url = `${this.baseUrl}${contract.findTests.path}${qs}`;
    return http.get(url, async () => {
      await delay("infinite");
      return HttpResponse.json({});
    });
  }

  findTestEntitiesCustom(
    filters:
      | { limit?: number; offset?: number; launchId?: number; "title~cnt"?: string }
      | undefined,
    responseCode: number,
    responseBody: any
  ) {
    const limit = filters?.limit ?? 25;
    const offset = filters?.offset ?? 0;
    const launchId = filters?.launchId;
    const title = filters?.["title~cnt"];
    const qs = `?limit=${limit}&offset=${offset}${launchId !== undefined ? `&launchId=${launchId}` : ``}${title !== undefined ? `&title~cnt=${encodeURIComponent(title)}` : ``}`;
    const url = `${this.baseUrl}${contract.findTests.path}${qs}`;
    return http.get(url, () => {
      return HttpResponse.json(responseBody, { status: responseCode });
    });
  }

  findLaunchesCountCustom(
    filters: { },
    responseCode: number,
    responseBody: any
  ) {
    return http.get(
      `${this.baseUrl}${contract.findLaunchesCount.path}`,
      () => {
        return HttpResponse.json(responseBody, { status: responseCode });
      }
    );
  }

  findLaunchesCountInfinite(filters: { }) {
    return http.get(
      `${this.baseUrl}${contract.findLaunchesCount.path}`,
      async () => {
        await delay("infinite");
        return HttpResponse.json({});
      }
    );
  }
}

export type TestEntity = FindTestsResponseData["items"][0];

export type FindTestsResponseData = ClientInferResponseBody<
  typeof contract.findTests,
  200
>;

export type ReadTestResponseData = ClientInferResponseBody<
  typeof contract.readTest,
  200
>;
