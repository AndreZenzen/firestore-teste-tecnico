import type { Config } from "jest";
const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: ".*\\.e2e\\.ts$",
  testPathIgnorePatterns: ["/node_modules/", "/lib/"],
  modulePathIgnorePatterns: ["/lib/"],
};
export default config;
