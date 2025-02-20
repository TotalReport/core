import { contract } from "@total-report/core-contract/contract";
import { PAGINATION_DEFAULTS } from "@total-report/core-contract/defaults";
import { AppRouteImplementation } from "@ts-rest/express";
import { TestEntitiesDAO } from "../db/test-entities.js";

export const findTestEntitiesRoute: FindTestEntitiesRoute = async ({
  query,
}) => {
  const pagination = {
    limit: query.limit ?? PAGINATION_DEFAULTS.limit,
    offset: query.offset ?? PAGINATION_DEFAULTS.offset,
  };

  const search = {
    entityTypes: query.entityTypes,
    reportId: query.reportId,
    launchId: query.launchId,
    contextId: query.contextId,
    correlationId: query.correlationId,
    argumentsHash: query.argumentsHash,
    distinct: query.distinct,
    titleContains: query["title~cnt"],
  };

  const searchResults = await new TestEntitiesDAO().find(search, pagination);

  return {
    status: 200,
    body: {
      pagination: searchResults.pagination,
      items: searchResults.items.map((item) => {
        return {
          launchId: item.launchId,
          parentContextId: item.parentContextId,
          id: item.id,
          entityType: item.entityType,
          title: item.title,
          createdTimestamp: item.createdTimestamp.toISOString(),
          startedTimestamp: item.startedTimestamp?.toISOString(),
          finishedTimestamp: item.finishedTimestamp?.toISOString(),
          statusId: item.statusId,
          correlationId: item.correlationId,
          argumentsHash: item.argumentsHash,
        };
      }),
    },
  };
};

export type FindTestEntitiesRoute = AppRouteImplementation<
  typeof contract.findTestEntities
>;
