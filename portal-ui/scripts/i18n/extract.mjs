import glob from "glob";
import fs from "fs";
import path from "path";
import { __dirname, extractI18nKey } from "./utils.mjs";

const target = path
  .join(__dirname, "../../src/**/*.ts{,x}")
  .replace(/\\/g, "/");

console.log("==== 国际化 t 函数 key 提取开始 START ====");
console.log("target", target);

glob(target, (err, files) => {
  const lang = [];
  files.forEach((filePath) => {
    const code = fs.readFileSync(filePath).toString("utf-8");
    const data = extractI18nKey(code, path.join(__dirname, "../", filePath));
    lang.push(...data);
  });

  // 生成日志
  fs.writeFileSync(
    path.join(__dirname, "./lang_log.json"),
    JSON.stringify(lang, null, 2)
  );

  const lang_en = {};
  // 去重
  lang.forEach(({ key, value }) => {
    if (!lang_en[key]) {
      lang_en[key] = value;
    }
  });

  // 生成语言文件
  fs.writeFileSync(
    path.join(__dirname, "./en.json"),
    JSON.stringify(lang_en, null, 2)
  );
  console.log("==== 国际化 t 函数 key 提取结束 END ====");
});
