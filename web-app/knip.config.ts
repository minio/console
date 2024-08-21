import type { KnipConfig } from "knip";

export default {
  entry: ["src/**/{index,main}.{ts,tsx}", "e2e/**/*.ts", "test/**/*.ts"],
  project: [
    "src/**/*.{ts,tsx}",
    "!src/api/**/*",
    "e2e/**/*.{ts,tsx}",
    "test/**/*.ts",
  ],
  rules: {
    binaries: "error",
    classMembers: "error",
    dependencies: "error",
    devDependencies: "off",
    duplicates: "error",
    files: "error",
    nsExports: "error",
    nsTypes: "error",
    unlisted: "error",
    unresolved: "error",
    types: "error",
    exports: "error",
    enumMembers: "off",
  },
} satisfies KnipConfig;
