import {
  FinishedTimestampBeforeStartedTimestampError,
  FinishedTimestampIsSetButStatusIsNotSetError,
  StartedTimestampBeforeCreatedTimestampError,
  StartedTimestampIsNotSetButFinishedTimestampIsSetError,
  StatusIsSetButFinishedTimestampIsNotSetError,
  TitleIsEmptyError,
} from "../errors/errors.js";

export const validateTitle = (args: { title?: string }) => {
  if (args.title == null || args.title.length === 0) {
    throw new TitleIsEmptyError();
  }
}

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

export const validateTimestampsAndStatus = (args: {
  createdTimestamp: Date;
  startedTimestamp?: Date | null;
  finishedTimestamp?: Date | null;
  statusId?: string | null;
}) => {
  validateTimestamps(args);
  if (args.finishedTimestamp != undefined && args.statusId == undefined) {
    throw new FinishedTimestampIsSetButStatusIsNotSetError();
  }

  if (args.statusId != undefined && args.finishedTimestamp == undefined) {
    throw new StatusIsSetButFinishedTimestampIsNotSetError();
  }
};
