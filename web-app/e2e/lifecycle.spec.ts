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

import { expect, Page } from "@playwright/test";
import { test as baseTest } from "./fixtures/baseFixture";
import { minioadminFile } from "./consts";
import { BucketsListPage } from "./pom/BucketsListPage";
import { CreateBucketPage } from "./pom/CreateBucketPage";
import { BucketSummaryPage } from "./pom/BucketSummaryPage";

type LifeCycleObjectVersionFx = {
  activeBucketName: string;
  bucketsListPage: BucketsListPage;
  createBucketPage: CreateBucketPage;
  bucketSummaryPage: any;
};

const test = baseTest.extend<LifeCycleObjectVersionFx>({
  activeBucketName: "",
  bucketListPage: async ({ page }: { page: Page }, use: any) => {
    let bucketListPage = new BucketsListPage(page);
    await bucketListPage.loadPage();
    await bucketListPage.goToCreateBucket();
    await use(bucketListPage);
  },
  createBucketPage: async ({ page }: { page: Page }, use: any) => {
    let createBucketPage = new CreateBucketPage(page);
    await use(createBucketPage);
  },
  //bucket name is dynamic in parallel test runs.
  bucketSummaryPage: async ({ page }: { page: Page }, use: any) => {
    await use((bucketName: string) => {
      return new BucketSummaryPage(page, bucketName);
    });
  },
});

test.use({ storageState: minioadminFile });

const versionedBucketName = "versioned-bucket";
const nonVersionedBucketName = "non-versioned-bucket";

test.describe("Add Lifecycle Rule Modal in bucket settings tests for object version ", () => {
  test("Test if Object Version selector is present in Lifecycle rule modal", async ({
    page,
    bucketListPage,
    createBucketPage,
    bucketSummaryPage,
  }) => {
    await test.step("Create Versioned Bucket", async () => {
      await createBucketPage.createVersionedBucket(versionedBucketName);
      await bucketListPage.clickOnBucketRow(versionedBucketName);
      bucketSummaryPage = bucketSummaryPage(versionedBucketName);
      await bucketSummaryPage.clickOnTab("lifecycle"); //Tab Text is used.
    });

    await test.step("Check if object version option is available on a versioned bucket", async () => {
      const objectVersionsEl = await bucketSummaryPage.getObjectVersionOption();
      await expect(await objectVersionsEl).toHaveText("Current Version");
      await expect(await objectVersionsEl).toBeTruthy();
      await bucketSummaryPage.getLocator("#close").click();
    });

    await test.step("Clean up bucket and verify the clean up", async () => {
      await bucketSummaryPage.confirmDeleteBucket();
      const existBukCount =
        await bucketListPage.isBucketExist(versionedBucketName);
      await expect(existBukCount).toEqual(0);
    });
  });

  test("Test if Object Version selector is NOT present in Lifecycle rule modal", async ({
    page,
    createBucketPage,
    bucketListPage,
    bucketSummaryPage,
  }) => {
    await test.step("Create NON Versioned Bucket and navigate to lifecycle settings in summary page", async () => {
      await createBucketPage.createBucket(nonVersionedBucketName);
      await bucketListPage.clickOnBucketRow(nonVersionedBucketName);
      bucketSummaryPage = bucketSummaryPage(versionedBucketName);
      await bucketSummaryPage.clickOnTab("lifecycle");
    });

    await test.step("Check if object version option is NOT available on a non versioned bucket", async () => {
      const objectVersionsEl = await bucketSummaryPage.getObjectVersionOption();
      await expect(await objectVersionsEl.count()).toEqual(0);
      await bucketSummaryPage.getLocator("#close").click();
    });

    await test.step("Clean up bucket and verify the clean up", async () => {
      await bucketSummaryPage.confirmDeleteBucket();
      const existBukCount = await bucketListPage.isBucketExist(
        nonVersionedBucketName,
      );
      await expect(existBukCount).toEqual(0);
    });
  });
});
