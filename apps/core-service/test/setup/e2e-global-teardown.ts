import { execSync } from "child_process";

module.exports = function globalSetup() {
  execSync("pnpm run test:app:down");
};
