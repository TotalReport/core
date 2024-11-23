export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class TitleIsEmptyError extends ValidationError {
  constructor() {
    super("Title is empty.");
  }
}

export class ReportNotFoundError extends ValidationError {
  constructor(reportId: number) {
    super("Report with id " + reportId + " is not found.");
  }
}

export class LaunchNotFoundError extends ValidationError {
  constructor(launchId: number) {
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
    super(`Started timestamp ${startedTimestamp.toISOString()} is before created timestamp ${createdTimestamp.toISOString()}.`);
  }
}

export class FinishedTimestampBeforeStartedTimestampError extends ValidationError {
  constructor(finishedTimestamp: Date, startedTimestamp: Date) {
    super(`Finished timestamp ${finishedTimestamp.toISOString()} is before started timestamp ${startedTimestamp.toISOString()}.`);
  }
}

export class ParentTestContextBelongsToDifferentLaunchError extends ValidationError {
  constructor(args: {
    parentTestContextId: number;
    parentTestContextLaunchId: number;
    expectedLaunchId: number;
  }) {
    super(
      `Parent test context ${args.parentTestContextId} belongs to different launch ${args.parentTestContextLaunchId}. Expected ${args.expectedLaunchId}.`
    );
  }
}

export class TestContextBelongsToDifferentLaunchError extends ValidationError {
  constructor(args: {
    testContextId: number;
    testContextLaunchId: number;
    expectedLaunchId: number;
  }) {
    super(
      `Test context ${args.testContextId} belongs to different launch ${args.testContextLaunchId}. Expected ${args.expectedLaunchId}.`
    );
  }
}

export class FinishedTimestampIsSetButStatusIsNotSetError extends ValidationError {
  constructor() {
    super("Finished timestamp is set but status is not set.");
  }
}

export class FinishedTimestampIsSetButSuccessIsNotSetError extends ValidationError {
  constructor() {
    super("Finished timestamp is set but success is not set.");
  }
}

export class StatusIsSetButFinishedTimestampIsNotSetError extends ValidationError {
  constructor() {
    super("Status is set but finished timestamp is not set.");
  }
}

export class SuccessIsSetButFinishedTimestampIsNotSetError extends ValidationError {
  constructor() {
    super("Success is set but finished timestamp is not set.");
  }
}

export class BeforeTestNotFoundError extends ValidationError {
  constructor(beforeTestId: number) {
    super("Before test with id " + beforeTestId + " is not found.");
  }
}

export class TestNotFoundError extends ValidationError {
  constructor(testId: number) {
    super("Test with id " + testId + " is not found.");
  }
}

export class AfterTestNotFoundError extends ValidationError {
  constructor(afterTestId: number) {
    super("After test with id " + afterTestId + " is not found.");
  }
}

export class BeforeTestStepNotFoundError extends ValidationError {
  constructor(beforeTestStepId: number) {
    super("Before test step with id " + beforeTestStepId + " is not found.");
  }
}

export class TestStepNotFoundError extends ValidationError {
  constructor(testStepId: number) {
    super("Test step with id " + testStepId + " is not found.");
  }
}

export class AfterTestStepNotFoundError extends ValidationError {
  constructor(afterTestStepId: number) {
    super("After test step with id " + afterTestStepId + " is not found.");
  }
}
