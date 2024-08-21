import type { KnipConfig } from "knip";

export default {
  entry: [
    "src/**/{index,main}.{ts,tsx}",
    "e2e/**/*.{ts,tsx}",
    "test/**/*.{ts,tsx}",
  ],
  project: [
    "src/**/*.{ts,tsx}",
    "!src/api/**/*",
    "e2e/**/*.{ts,tsx}",
    "test/**/*.{ts,tsx}",
  ],
  rules: {
    binaries: "error",
    classMembers: "error",
    dependencies: "off",
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
