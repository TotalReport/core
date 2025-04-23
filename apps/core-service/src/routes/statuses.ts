import { contract } from "@total-report/core-contract/contract";
import { AppRouteImplementation } from "@ts-rest/express";
import { TestStatusGroupsDAO } from "../db/test-status-groups.js";
import { TestStatusesDAO } from "../db/test-statuses.js";

export const findTestStatusGroupsRoute: FindTestStatusGroupsRoute =
  async ({}) => {
    const searchResults = await new TestStatusGroupsDAO().find();

    return {
      status: 200,
      body: {
        items: searchResults.map((item) => {
          return {
            id: item.id,
            title: item.title,
            createdTimestamp: item.createdTimestamp.toISOString(),
            color: item.color,
          };
        }),
      },
    };
  };

export const findTestStatusesRoute: FindTestStatusesRoute = async () => {
  const searchResults = await new TestStatusesDAO().find();

  return {
    status: 200,
    body: {
      items: searchResults.map((item) => {
        return {
          id: item.id,
          title: item.title,
          createdTimestamp: item.createdTimestamp.toISOString(),
          groupId: item.groupId,
          color: item.color,
        };
      }),
    },
  };
};

export const readTestStatusGroupRoute: ReadTestStatusGroupRoute = async ({
  params,
}) => {
  const statusGroup = await new TestStatusGroupsDAO().findById(params.id);
  if (statusGroup === undefined) {
    return {
      status: 404,
      body: {},
    };
  }
  return {
    status: 200,
    body: {
      id: statusGroup.id,
      title: statusGroup.title,
      createdTimestamp: statusGroup.createdTimestamp.toISOString(),
      color: statusGroup.color,
    },
  };
};

export const readTestStatusRoute: ReadTestStatusRoute = async ({ params }) => {
  const status = await new TestStatusesDAO().findById(params.id);
  if (status === undefined) {
    return {
      status: 404,
      body: {},
    };
  }
  return {
    status: 200,
    body: {
      id: status.id,
      title: status.title,
      createdTimestamp: status.createdTimestamp.toISOString(),
      groupId: status.groupId,
      color: status.color,
    },
  };
};

export type FindTestStatusGroupsRoute = AppRouteImplementation<
  typeof contract.findTestStatusGroups
>;

export type FindTestStatusesRoute = AppRouteImplementation<
  typeof contract.findTestStatuses
>;

export type ReadTestStatusGroupRoute = AppRouteImplementation<
  typeof contract.readTestStatusGroup
>;

export type ReadTestStatusRoute = AppRouteImplementation<
  typeof contract.readTestStatus
>;
