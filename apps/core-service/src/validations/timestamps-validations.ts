import {
  FinishedTimestampBeforeStartedTimestampError,
  FinishedTimestampIsSetButStatusIsNotSetError,
  StartedTimestampBeforeCreatedTimestampError,
  StartedTimestampIsNotSetButFinishedTimestampIsSetError,
  StatusIsSetButFinishedTimestampIsNotSetError,
} from "../errors/errors.js";

export const validateTimestamps = (args: {
  createdTimestamp: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
}) => {
  if (args.startedTimestamp == undefined) {
    if (args.finishedTimestamp != undefined) {
      throw new StartedTimestampIsNotSetButFinishedTimestampIsSetError();
    }
  } else {
    if (args.createdTimestamp > args.startedTimestamp) {
      throw new StartedTimestampBeforeCreatedTimestampError(
        args.startedTimestamp,
        args.createdTimestamp
      );
    }

    if (
      args.finishedTimestamp != undefined &&
      args.startedTimestamp > args.finishedTimestamp
    ) {
      throw new FinishedTimestampBeforeStartedTimestampError(
        args.finishedTimestamp,
        args.startedTimestamp
      );
    }
  }
};

export const validateTimestamptAndStatus = (args: {
  createdTimestamp: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
  status?: string;
}) => {
  validateTimestamps(args);
  if (args.finishedTimestamp != undefined && args.status == undefined) {
    throw new FinishedTimestampIsSetButStatusIsNotSetError();
  }

  if (args.status != undefined && args.finishedTimestamp == undefined) {
    throw new StatusIsSetButFinishedTimestampIsNotSetError();
  }
};
