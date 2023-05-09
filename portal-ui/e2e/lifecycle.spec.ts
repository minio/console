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
import { BUCKET_LIST_PAGE } from "./consts";

test.use({ storageState: minioadminFile });

const bucketListLocPrefix = "#manageBucket";
const versionedBucketName = "versioned-bucket";
const nonVersionedBucketName = "non-versioned-bucket";

test.describe("Add Lifecycle Rule Modal in bucket settings tests for object version ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BUCKET_LIST_PAGE);
  });

  test("Test if Object Version selector is present in Lifecycle rule modal", async ({
    page,
  }) => {
    const bucketLocatorEl = `${bucketListLocPrefix}-${versionedBucketName}`;

    await test.step(`Create bucket`, async () => {
      await page.locator("#create-bucket").click();
      await page.getByLabel("Bucket Name*").click();
      await page.getByLabel("Bucket Name*").type(versionedBucketName);
      await page.locator("#versioned").check();
      await page.getByRole("button", { name: "Create Bucket" }).click();
    });

    await test.step("Navigate to manage bucket", async () => {
      await page.locator(bucketLocatorEl).click();
      await page.getByRole("tab", { name: "Lifecycle" }).click();
    });

    const result =
      await test.step("Trigger Add Lifecycle Rule Modal and verify", async () => {
        await page.getByRole("button", { name: "Add Lifecycle Rule" }).click();
        return await page.locator("#object_version");
      });

    await expect(result).toBeTruthy();

    await test.step("Close confirm Modal", async () => {
      await page.locator("#close").click();
    });

    await test.step("List Bucket", async () => {
      await page.goto(BUCKET_LIST_PAGE);
      await page.locator(bucketLocatorEl).click();
    });

    await test.step("Click on delete bucket and confirm", async () => {
      await page.locator("#delete-bucket-button").click();
      await page.locator("#confirm-ok").click();
    });

    const bucketListItemCount =
      await test.step("Verify the bucket deletion ", async () => {
        const listItemsCount = await page.locator(bucketLocatorEl);
        return listItemsCount.count();
      });

    await expect(bucketListItemCount).toEqual(0);
  });

  test("Test if Object Version selector is not present when bucket is not versioned", async ({
    page,
  }) => {
    const bucketLocatorEl = `${bucketListLocPrefix}-${nonVersionedBucketName}`;

    await test.step(`Create bucket`, async () => {
      await page.locator("#create-bucket").click();
      await page.getByLabel("Bucket Name*").click();
      await page.getByLabel("Bucket Name*").type(nonVersionedBucketName);
      await page.getByRole("button", { name: "Create Bucket" }).click();
    });

    await test.step("Navigate to manage bucket", async () => {
      await page.locator(bucketLocatorEl).click();
      await page.getByRole("tab", { name: "Lifecycle" }).click();
    });

    const result =
      await test.step("Trigger Add Lifecycle Rule Modal and verify", async () => {
        await page.getByRole("button", { name: "Add Lifecycle Rule" }).click();
        return await page.locator("#object_version").count();
      });

    await expect(result).toEqual(0);

    await test.step("Close confirm Modal", async () => {
      await page.locator("#close").click();
    });

    await test.step("List bucket", async () => {
      await page.goto(BUCKET_LIST_PAGE);
      await page.locator(bucketLocatorEl).click();
    });

    await test.step("Delete bucket ", async () => {
      await page.locator("#delete-bucket-button").click();
      await page.locator("#confirm-ok").click();
    });

    const bucketListItemCount =
      await test.step("Verify the bucket deletion ", async () => {
        const listItemsCount = await page.locator(bucketLocatorEl);
        return listItemsCount.count();
      });

    await expect(bucketListItemCount).toEqual(0);
  });
});
