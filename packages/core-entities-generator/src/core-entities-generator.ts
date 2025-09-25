import { AfterTestsGenerator } from "./after-test-generator.js";
import { AfterTestStepsGenerator } from "./after-test-step-generator.js";
import { BeforeTestsGenerator } from "./before-test-generator.js";
import { BeforeTestStepsGenerator } from "./before-test-step-generator.js";
import { LaunchesGenerator } from "./launch-generator.js";
import { ReportsGenerator } from "./report-generator.js";
import { TestContextsGenerator } from "./test-context-generator.js";
import { TestsGenerator } from "./test-generator.js";
import { TestStepsGenerator } from "./test-step-generator.js";
import { ClientType } from "./types.js";

export class CoreEntititesGenerator {
  readonly client: ClientType;
  readonly reports: ReportsGenerator;
  readonly launches: LaunchesGenerator;
  readonly contexts: TestContextsGenerator;
  readonly beforeTests: BeforeTestsGenerator;
  readonly beforeTestSteps: BeforeTestStepsGenerator;
  readonly tests: TestsGenerator;
  readonly testSteps: TestStepsGenerator;
  readonly afterTests: AfterTestsGenerator;
  readonly afterTestSteps: AfterTestStepsGenerator;

  constructor(client: ClientType) {
    this.client = client;
    this.reports = new ReportsGenerator(this.client);
    this.launches = new LaunchesGenerator(this.client);
    this.contexts = new TestContextsGenerator(this.client);
    this.beforeTests = new BeforeTestsGenerator(this.client);
    this.beforeTestSteps = new BeforeTestStepsGenerator(this.client);
    this.tests = new TestsGenerator(this.client);
    this.testSteps = new TestStepsGenerator(this.client);
    this.afterTests = new AfterTestsGenerator(this.client);
    this.afterTestSteps = new AfterTestStepsGenerator(this.client);
  }
}
