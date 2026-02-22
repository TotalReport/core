import { StatusEntity } from "@/hooks/api/statuses/use-find-statuses.jsx";
import { StatusGroupEntity } from "@/hooks/api/status-groups/use-find-status-groups.js";
import { TestEntity } from "@/hooks/api/test-entities/use-find-test-entities.js";

export type FormattedTestEntity = {
  id: number;
  title: string;
  status?: {
    id: string;
    name: string;
    color: string;
    createdTimestamp: string;
    group: {
      id: string;
      name: string;
      color: string;
      createdTimestamp: string;
    };
  };
  startedTimestamp: string;
  finishedTimestamp?: string | null;
  entityType: string;
  correlationId?: string | null;
  argumentsHash?: string | null;
};

export function formatTestEntity(
  test: TestEntity,
  statuses: StatusEntity[],
  statusGroups: StatusGroupEntity[]
): FormattedTestEntity {
  return {
    id: test.id,
    title: test.title,
    status: formatStatus(test.statusId, statuses, statusGroups),
    startedTimestamp: test.startedTimestamp,
    finishedTimestamp: test.finishedTimestamp,
    entityType: test.entityType,
    correlationId: test.correlationId,
    argumentsHash: test.argumentsHash,
  };
}

export function formatTestDetails(
  test: any,
  statuses: StatusEntity[],
  statusGroups: StatusGroupEntity[],
  entityType: string
): FormattedTestEntity {
  return {
    id: test.id,
    title: test.title,
    status: formatStatus(test.statusId, statuses, statusGroups),
    startedTimestamp: test.startedTimestamp,
    finishedTimestamp: test.finishedTimestamp,
    entityType: entityType,
    correlationId: test.correlationId,
    argumentsHash: test.argumentsHash,
  };
}

function formatStatus(
  statusId: string | undefined,
  statuses: StatusEntity[],
  statusGroups: StatusGroupEntity[]
): FormattedTestEntity["status"] {
  if (!statusId) return undefined;
  
  const status = statuses.find((status) => status.id === statusId);
  if (!status) return undefined;

  const group = statusGroups.find((group) => group.id === status.groupId);
  if (!group) return undefined;

  return {
    id: status.id,
    name: status.title,
    color: status.color,
    createdTimestamp: status.createdTimestamp,
    group: {
      id: group.id,
      name: group.title,
      color: group.color,
      createdTimestamp: group.createdTimestamp,
    },
  };
}

export function getTestTypeFromEntityType(entityType: string): 'test' | 'beforeTest' | 'afterTest' {
  switch (entityType) {
    case 'beforeTest':
      return 'beforeTest';
    case 'afterTest':
      return 'afterTest';
    default:
      return 'test';
  }
}

export function getDisplayNameForEntityType(entityType: string): string {
  switch (entityType) {
    case 'beforeTest':
      return 'Before Test';
    case 'afterTest':
      return 'After Test';
    case 'test':
    default:
      return 'Test';
  }
}
