export default {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testEnvironment: "node",
  testTimeout: 20000,
  globalSetup: "<rootDir>/setup/e2e-global-setup.ts",
  globalTeardown: "<rootDir>/setup/e2e-global-teardown.ts",
};
