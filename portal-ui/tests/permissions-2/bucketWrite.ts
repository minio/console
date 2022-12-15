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
import { bucketsElement } from "../utils/elements-menu";
import { testBucketBrowseButtonFor } from "../utils/functions";
import { Selector } from "testcafe";
import * as constants from "../utils/constants";

fixture("For user with Bucket Write permissions").page("http://localhost:9090");

test("Buckets sidebar item exists", async (t) => {
  const bucketsExist = bucketsElement.with({ boundTestRun: t }).exists;
  await t.useRole(roles.bucketWrite).expect(bucketsExist).ok();
});

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "bucketwritew");
  })("Bucket access is set to W", async (t) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await t
      .useRole(roles.bucketWrite)
      .navigateTo("http://localhost:9090/buckets")
      .expect(
        Selector("h1")
          .withText(`${constants.TEST_BUCKET_NAME}-bucketwritew`)
          .parent(1)
          .find("p")
          .nth(-1).innerText
      )
      .eql("Access: W");
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucketAndUploads(t, "bucketwritew");
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "bucketwrite2");
  })("Upload button exists", async (t) => {
    const uploadExists = elements.uploadButton.exists;
    const testBucketBrowseButton = testBucketBrowseButtonFor("bucketwrite2");
    await t
      .useRole(roles.bucketWrite)
      .navigateTo("http://localhost:9090/browser")
      .click(testBucketBrowseButton)
      .expect(uploadExists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucketAndUploads(t, "bucketwrite2");
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "bucketwrite3");
  })("Object can be uploaded to a bucket", async (t) => {
    const testBucketBrowseButton = testBucketBrowseButtonFor("bucketwrite3");
    await t
      .useRole(roles.bucketWrite)
      .navigateTo("http://localhost:9090/browser")
      .click(testBucketBrowseButton)
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt");
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucketAndUploads(t, "bucketwrite3");
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "bucketwrite4");
  })("Object list table is disabled", async (t) => {
    await t
      .useRole(roles.bucketWrite)
      .navigateTo("http://localhost:9090/browser")
      .click(testBucketBrowseButtonFor("bucketwrite4"))
      .expect(elements.bucketsTableDisabled.exists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucketAndUploads(t, "bucketwrite4");
  });
