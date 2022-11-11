import path from "path";
import { fileURLToPath } from "url";
import babelParser from "@babel/parser";
import traverse from "@babel/traverse";
import t from "@babel/types";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

const createAst = (code) => {
  return babelParser.parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
};

export function extractI18nKey(code, filePath) {
  let ast = createAst(code);
  const langs = [];

  const isIncludeImportModule = ast.program.body.find((n) => {
    return t.isImportDeclaration(n) && n.source.value === "i18next";
  });
  if (!isIncludeImportModule) {
    return [];
  }

  traverse.default(ast, {
    CallExpression(p) {
      const fnName = p.node.callee.name;
      const args = p.node.arguments;

      if (fnName === "t") {
        if (Array.isArray(args)) {
          const [arg] = args;
          const key = arg.value;
          langs.push({
            key,
            value: key,
            filePath,
            pos: p.node.loc?.start,
          });
        }
      }
    },
  });

  return langs;
}
