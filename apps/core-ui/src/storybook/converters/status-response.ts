import { contract } from "@total-report/core-contract/contract";
import { ClientInferResponseBody } from "@ts-rest/core";

export type StatusResponse = ClientInferResponseBody<
  typeof contract.readTestStatus,
  200
>;
export type StatusGroupResponse = ClientInferResponseBody<
  typeof contract.readTestStatusGroup,
  200
>;

export function toStatusGroupResponse(group: {
  id: string;
  title: string;
  color: string;
}): StatusGroupResponse {
  return {
    id: group.id,
    title: group.title,
    color: group.color,
    createdTimestamp: "2024-01-01T10:00:00Z",
  };
}

export function toStatusResponse(status: {
  id: string;
  title: string;
  groupId: string;
  color: string;
}): StatusResponse {
  return {
    id: status.id,
    title: status.title,
    groupId: status.groupId,
    color: status.color,
    createdTimestamp: "2024-01-01T10:00:00Z",
  };
}
