/* eslint-disable */
export default {
  displayName: "java-ast",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: {
    "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageDirectory: "../../coverage/libs/java-ast",
  coverageThreshold: {
    global: {
      branches: 82,
      lines: 82,
    },
  },
};
