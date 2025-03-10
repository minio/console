// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

import * as roles from "../utils/roles";
import * as elements from "../utils/elements";
import * as functions from "../utils/functions";
import {
  namedManageButtonFor,
  namedTestBucketBrowseButtonFor,
} from "../utils/functions";
import { bucketsElement, logoutItem } from "../utils/elements-menu";
import { Selector } from "testcafe";
import { acknowledgeButton } from "../utils/elements";

const TEST_BUCKET_NAME_SPECIFIC = "specific-bucket";

fixture("For user with permissions that only allow specific Buckets").page(
  "http://localhost:9090",
);

// Bucket read tests

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-6`);
    await t
      .useRole(roles.admin)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, `${TEST_BUCKET_NAME_SPECIFIC}-6`)
      .click(namedTestBucketBrowseButtonFor(`${TEST_BUCKET_NAME_SPECIFIC}-6`))
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt")
      .click(logoutItem);
  })("Object list table is enabled", async (t) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await t
      .useRole(roles.bucketRead)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, `${TEST_BUCKET_NAME_SPECIFIC}-6`)
      .click(namedTestBucketBrowseButtonFor(`${TEST_BUCKET_NAME_SPECIFIC}-6`))
      .expect(elements.table.exists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucketAndUploads(
      t,
      `${TEST_BUCKET_NAME_SPECIFIC}-6`,
    );
  });

// Bucket write tests

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-7`);
  })("Browse button exists", async (t) => {
    const testBucketBrowseButton = namedTestBucketBrowseButtonFor(
      `${TEST_BUCKET_NAME_SPECIFIC}-7`,
    );
    await t
      .useRole(roles.bucketSpecific)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, `${TEST_BUCKET_NAME_SPECIFIC}-7`)
      .expect(testBucketBrowseButton.exists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucketAndUploads(
      t,
      `${TEST_BUCKET_NAME_SPECIFIC}-7`,
    );
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-9`);
  })("Upload button exists", async (t) => {
    const uploadExists = elements.uploadButton.exists;
    const testBucketBrowseButton = namedTestBucketBrowseButtonFor(
      `${TEST_BUCKET_NAME_SPECIFIC}-9`,
    );
    await t
      .useRole(roles.bucketSpecific)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, `${TEST_BUCKET_NAME_SPECIFIC}-9`)
      .click(testBucketBrowseButton)
      .expect(uploadExists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucketAndUploads(
      t,
      `${TEST_BUCKET_NAME_SPECIFIC}-9`,
    );
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-10`);
  })("Object can be uploaded to a bucket", async (t) => {
    const testBucketBrowseButton = namedTestBucketBrowseButtonFor(
      `${TEST_BUCKET_NAME_SPECIFIC}-10`,
    );
    await t
      .useRole(roles.bucketSpecific)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, `${TEST_BUCKET_NAME_SPECIFIC}-10`)
      .click(testBucketBrowseButton)
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt");
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucketAndUploads(
      t,
      `${TEST_BUCKET_NAME_SPECIFIC}-10`,
    );
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-11`);
  })("Object list table is disabled", async (t) => {
    await t
      .useRole(roles.bucketSpecific)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, `${TEST_BUCKET_NAME_SPECIFIC}-11`)
      .click(namedTestBucketBrowseButtonFor(`${TEST_BUCKET_NAME_SPECIFIC}-11`))
      .expect(elements.bucketsTableDisabled.exists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucketAndUploads(
      t,
      `${TEST_BUCKET_NAME_SPECIFIC}-11`,
    );
  });
