import { tsr } from "@/lib/react-query";
import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export const useFindTestEntities = ({
  pagination: { offset, limit },
}: FindTestEntitiesParams): FindTestEntitiesResponse => {
  const query = tsr.findTestEntities.useQuery({
    queryKey: ["test-entities", offset, limit],
    queryData: {
      query: {
        offset: offset,
        limit: limit,
      },
    },
  });

  return {
    isPending: query.isPending,
    isError: query.isError,
    data: query.data?.status === 200 ? query.data.body : null,
  };
};

export type FindTestEntitiesParams = {
  pagination: {
    offset: number;
    limit: number;
  };
};

export type FindTestEntitiesResponse = {
  isPending: boolean;
  isError: boolean;
  data: FindTestEntitiesResponseData | null;
};

export type TestEntity = FindTestEntitiesResponseData["items"][0];

export type FindTestEntitiesResponseData = ClientInferResponseBody<
  typeof contract.findTestEntities,
  200
>;
