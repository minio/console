// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

import i18next from "i18next";
import HttpApi from "i18next-http-backend";

const LangCacheKey = "language";

export const languages = { en: "English", zh: "中文-简体" } as const;

type LangKey = keyof typeof languages;

export const getLanguage = (): LangKey => {
  const cacheKey = localStorage.getItem(LangCacheKey);
  if (cacheKey) {
    return cacheKey as LangKey;
  }
  // return (window.navigator.language.split("-")[0].toLocaleLowerCase() as LangKey) || "en";
  return "en";
};

export const setLanguage = (lang: LangKey) => {
  localStorage.setItem(LangCacheKey, lang);
};

export const i18nInit = () => {
  return i18next.use(HttpApi).init({
    lng: getLanguage(),
    debug: false,
    fallbackLng: "en",
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });
};
