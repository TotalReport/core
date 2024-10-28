import { AfterTestsGenerator } from "./after-test-generator.js";
import { BeforeTestsGenerator } from "./before-test-generator.js";
import { LaunchesGenerator } from "./launch-generator.js";
import { ReportsGenerator } from "./report-generator.js";
import { TestContextsGenerator } from "./test-context-generator.js";
import { TestsGenerator } from "./test-generator.js";
import { ClientType } from "./types.js";

export class CoreEntititesGenerator {
    readonly client: ClientType;
    readonly reports: ReportsGenerator;
    readonly launches: LaunchesGenerator;
    readonly contexts: TestContextsGenerator;
    readonly beforeTests: BeforeTestsGenerator;
    readonly tests: TestsGenerator;
    readonly afterTests: AfterTestsGenerator;
    
    constructor(client: ClientType) {
        this.client = client;
        this.reports = new ReportsGenerator(this.client);
        this.launches = new LaunchesGenerator(this.client);
        this.contexts = new TestContextsGenerator(this.client);
        this.beforeTests = new BeforeTestsGenerator(this.client);
        this.tests = new TestsGenerator(this.client);
        this.afterTests = new AfterTestsGenerator(this.client);
    }
}
