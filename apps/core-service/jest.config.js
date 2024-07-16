export default {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  testEnvironment: 'node',
  testTimeout: 20000
};