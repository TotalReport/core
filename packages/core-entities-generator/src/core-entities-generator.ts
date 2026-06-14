import { LaunchesGenerator } from "./launch-generator.js";
import { TestsGenerator } from "./test-generator.js";
import { TestStepsGenerator } from "./test-step-generator.js";
import { UsersGenerator } from "./user-generator.js";
import { ClientType } from "./types.js";

export class CoreEntititesGenerator {
  readonly client: ClientType;
  readonly launches: LaunchesGenerator;
  readonly tests: TestsGenerator;
  readonly testSteps: TestStepsGenerator;
  readonly users: UsersGenerator;

  constructor(client: ClientType) {
    this.client = client;
    this.launches = new LaunchesGenerator(this.client);
    this.tests = new TestsGenerator(this.client);
    this.testSteps = new TestStepsGenerator(this.client);
    this.users = new UsersGenerator(this.client);
  }
}
