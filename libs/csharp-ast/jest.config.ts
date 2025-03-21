/* eslint-disable */
export default {
  displayName: "csharp-ast",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/libs/csharp-ast",
  coverageThreshold: {
    global: {
      branches: 73,
      lines: 74,
    },
  },
};
