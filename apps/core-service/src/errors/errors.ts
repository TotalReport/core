export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class ReportNotFoundError extends ValidationError {
  constructor(reportId: string) {
    super("Report with id " + reportId + " is not found.");
  }
}

export class LaunchNotFoundError extends ValidationError {
  constructor(launchId: string) {
    super("Launch with id " + launchId + " is not found.");
  }
}

export class TestContextNotFoundError extends ValidationError {
  constructor(testContextId: number) {
    super("Test context " + testContextId + " is not found.");
  }
}

export class ParentTestContextNotFoundError extends ValidationError {
  constructor(parentTestContextId: number) {
    super("Parent test context " + parentTestContextId + " is not found.");
  }
}

export class ParentTestContextHasCircularParentTestContextReferenceError extends ValidationError {
  constructor(parentTestContextId: number) {
    super(`Parent test context ${parentTestContextId} has a circular reference.`);
  }
}

export class StartedTimestampIsNotSetButFinishedTimestampIsSetError extends ValidationError {
  constructor() {
    super("Started timestamp is not set, but finished timestamp is set.");
  }
}

export class StartedTimestampBeforeCreatedTimestampError extends ValidationError {
  constructor(startedTimestamp: Date, createdTimestamp: Date) {
    super(`Started timestamp ${startedTimestamp} is before created timestamp ${createdTimestamp}.`);
  }
}

export class FinishedTimestampBeforeStartedTimestampError extends ValidationError {
  constructor(finishedTimestamp: Date, startedTimestamp: Date) {
    super(`Finished timestamp ${finishedTimestamp} is before started timestamp ${startedTimestamp}.`);
  }
}

export class ParentTestContextBelongsToDifferentLaunchError extends ValidationError {
  constructor(args: {
    parentTestContextId: number;
    parentTestContextLaunchId: string;
    expectedLaunchId: string;
  }) {
    super(
      `Parent test context ${args.parentTestContextId} belongs to different launch ${args.parentTestContextLaunchId}. Expected ${args.expectedLaunchId}.`
    );
  }
}
