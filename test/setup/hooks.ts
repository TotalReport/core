import { execSync } from "child_process";

export const mochaHooks = {
  beforeAll(done: any) {
    (<any>this).timeout(20000);
    execSync("pnpm run test:app:up");
    done();
  },
  afterAll(done: any) {
    (<any>this).timeout(3000);
    execSync("pnpm run test:app:down");
    done();
  },
};
