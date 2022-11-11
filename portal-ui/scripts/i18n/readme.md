# 自动提取 `t("key")` 中的 `key`，并生成 `en.json` 文件

执行 `npm run extractI18Key` 命令后会自动遍历 `src` 目录下使用 `i18next` 的文件，并且提取 `key`, 去重后生成 `en.json`.

如果你使用其他语言，请直接对生成的 `en.json` 进行翻译即可, 翻译完成后在 `i18next.init` 中引入即可生效。

# Automatically extract `key` in `t("key")` and generate `en.json` file

After executing the `npm run extractI18Key` command, it will automatically traverse the files using `i18next` in the `src` directory, extract the `key`, and generate `en.json` after deduplication.

If you use other languages, please translate the generated `en.json` directly. After the translation is completed, import it in `i18next.init` to take effect.

## 使用示例 (Example)

```ts
// src/index.tsx

import i18next from "i18next";
import zh from "./lang/zh.json";

i18next.init({
  lng: "zh",
  debug: false,
  nsSeparator: false,
  keySeparator: false,
  fallbackLng: false,
  resources: {
    zh: {
      translation: zh,
    },
  },
});
```
