// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

import { expect } from "@playwright/test";
import { test } from "./fixtures/baseFixture";
import { minioadminFile } from "./consts";
import { pagePort } from "./consts";

test.use({ storageState: minioadminFile });

test.beforeEach(async ({ page }) => {
  await page.goto(pagePort);
});

test("Test if Object Version selector is present in Lifecycle rule modal", async ({
  page,
}) => {
  await page.locator("#create-bucket").click();
  await page.getByLabel("Bucket Name*").click();
  await page.getByLabel("Bucket Name*").fill("versioned-bucket");
  await page.locator("#versioned").check();
  await page.getByRole("button", { name: "Create Bucket" }).click();
  await page.locator("#manageBucket-versioned-bucket").click();
  await page.getByRole("tab", { name: "Lifecycle" }).click();
  await page.getByRole("button", { name: "Add Lifecycle Rule" }).click();
  await expect(await page.locator("#object_version")).toBeTruthy();
});

test("Test if Object Version selector is not present when bucket is not versioned", async ({
  page,
}) => {
  await page.locator("#create-bucket").click();
  await page.getByLabel("Bucket Name*").click();
  await page.getByLabel("Bucket Name*").fill("non-versioned-bucket");
  await page.getByRole("button", { name: "Create Bucket" }).click();
  await page.locator("#manageBucket-non-versioned-bucket").click();
  await page.getByRole("tab", { name: "Lifecycle" }).click();
  await page.getByRole("button", { name: "Add Lifecycle Rule" }).click();
  await expect(await page.locator("#object_version").count()).toEqual(0);
});
