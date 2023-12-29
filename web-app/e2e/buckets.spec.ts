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
import { generateUUID, test } from "./fixtures/baseFixture";
import { minioadminFile } from "./consts";
import { BUCKET_LIST_PAGE } from "./consts";

test.use({ storageState: minioadminFile });

test.beforeEach(async ({ page }) => {
  await page.goto(BUCKET_LIST_PAGE);
  await page.waitForTimeout(1000);
});

test("create a new bucket", async ({ page }) => {
  await page.getByRole("button", { name: "Buckets" }).click();
  await page.getByRole("button", { name: "Create Bucket" }).click();
  await page.getByLabel("Bucket Name*").click();

  const bucketName = `new-bucket-${generateUUID()}`;

  await page.getByLabel("Bucket Name*").fill(bucketName);
  await page.getByRole("button", { name: "Create Bucket" }).click();
  await page.waitForTimeout(2000);
  await page.locator("#refresh-buckets").click();
  await page.getByPlaceholder("Search Buckets").fill(bucketName);

  await expect(page.locator(`#manageBucket-${bucketName}`)).toBeTruthy();
  const bucketLocatorEl = `#manageBucket-${bucketName}`;
  await page.locator(bucketLocatorEl).click();
  await page.locator("#delete-bucket-button").click();
  //confirm modal
  await page.locator("#confirm-ok").click();
  const listItemsCount = await page.locator(bucketLocatorEl).count();
  await expect(listItemsCount).toEqual(0);
});

test("invalid bucket name", async ({ page }) => {
  await page.getByRole("button", { name: "Buckets" }).click();
  await page.getByRole("button", { name: "Create Bucket" }).click();
  await page.getByLabel("Bucket Name*").click();
  await page.getByLabel("Bucket Name*").fill("invalid name");
  await page.getByRole("button", { name: "View Bucket Naming Rules" }).click();
  await expect(
    page.getByText(
      "Bucket names can consist only of lowercase letters, numbers, dots (.), and hyphe",
    ),
  ).toBeTruthy();
});
