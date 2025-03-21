const nxPreset = require("@nx/jest/preset").default;

module.exports = {
  ...nxPreset,
  reporters: ["default", "github-actions"],
  coverageProvider: "v8",
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.ts",
    "!**/*.types.ts",
    "!**/*.interface.ts",
    "!**/*.template.ts",
    "!**/*.spec.ts",
    "!**/*.e2e-spec.ts",
    "!**/tests/e2e/**",
    "!**/node_modules/**",
    "!**/scripts/**",
    "!**/jest.config.ts",
    "!**/jest.**.config.ts",
    "!**/index.ts",
    "!**/((*.)?)enum.ts",
    "!**/((*.)?)constants.ts",
    "!**/main.ts",
  ],
  coverageThreshold: {
    global: {
      branches: 90,
      lines: 90,
    },
  },
};
