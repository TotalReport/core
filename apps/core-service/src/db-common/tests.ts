export type PatchTest = {
  id: number;
  title?: string;
  createdTimestamp?: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
  statusId?: string | null;
};

export const takeTestRowUpdateableFields = (
  args: PatchTest
): TestRowUpdateableFields => {
  return {
    title: args.title,
    createdTimestamp: args.createdTimestamp,
    startedTimestamp: args.startedTimestamp,
    finishedTimestamp: args.finishedTimestamp,
    statusId: args.statusId,
  };
};

export const applyPatchToTestRow = (args: {
  row: GenericTestRow;
  patch: TestRowUpdateableFields;
}): GenericTestRow => {
  return {
    launchId: args.row.launchId,
    testContextId: args.row.testContextId,
    id: args.row.id,
    title: firstNotUndefined(args.patch.title, args.row.title),
    createdTimestamp: firstNotUndefined(
      args.patch.createdTimestamp,
      args.row.createdTimestamp
    ),
    startedTimestamp: firstNotUndefined(
      args.patch.startedTimestamp,
      args.row.startedTimestamp
    ),
    finishedTimestamp: firstNotUndefined(
      args.patch.finishedTimestamp,
      args.row.finishedTimestamp
    ),
    statusId: firstNotUndefined(
      args.patch.statusId,
      args.row.statusId
    ),
    correlationId: args.row.correlationId,
    argumentsHash: args.row.argumentsHash,
  };
};

const firstNotUndefined = <T>(
  arg1: NonUndefined<T> | undefined,
  arg2: NonUndefined<T>
): NonUndefined<T> => {
  return arg1 === undefined ? arg2 : arg1;
};

export type NonUndefined<T> = T extends undefined ? never : T;

export type TestRowUpdateableFields = {
  title: string | undefined;
  createdTimestamp: Date | undefined;
  startedTimestamp: Date | null | undefined;
  finishedTimestamp: Date | null | undefined;
  statusId: string | null | undefined;
};

export type TestStepRowUpdateableFields = {
  title: string | undefined;
  createdTimestamp: Date | undefined;
  startedTimestamp: Date | null | undefined;
  finishedTimestamp: Date | null | undefined;
  isSuccessful: boolean | null | undefined;
  errorMessage: string | null | undefined;
};

type GenericTestRow = {
    id: number;
    title: string;
    createdTimestamp: Date;
    startedTimestamp: Date | null;
    finishedTimestamp: Date | null;
    statusId: string | null;
    launchId: number;
    testContextId: number | null;
    correlationId: string;
    argumentsHash: string;
}

export type Override<
  Type,
  NewType extends { [key in keyof Type]?: NewType[key] },
> = Omit<Type, keyof NewType> & NewType;
