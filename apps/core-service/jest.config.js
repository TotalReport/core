export default {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  testEnvironment: "node",
  testTimeout: 20000,
  globalSetup: "<rootDir>/test/setup/e2e-global-setup.ts",
  globalTeardown: "<rootDir>/test/setup/e2e-global-teardown.ts",
};
