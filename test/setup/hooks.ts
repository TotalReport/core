import { closeUserGeneratorDb } from "@total-report/core-entities-generator/user-generator";
import { execSync } from "child_process";

export const mochaHooks = {
  beforeAll(this: Mocha.Context) {
    this.timeout(20000);
    execSync("pnpm run test:app:up");
  },
  async afterAll(this: Mocha.Context) {
    this.timeout(3000);
    await closeUserGeneratorDb();
    execSync("pnpm run test:app:down");
  },
};
