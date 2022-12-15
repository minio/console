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
import { bucketsElement, logoutItem } from "../utils/elements-menu";
import { testBucketBrowseButtonFor } from "../utils/functions";
import { Selector } from "testcafe";
import * as constants from "../utils/constants";

fixture("For user with Bucket Read permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.bucketRead);
  });

test("Buckets sidebar item exists", async (t) => {
  const bucketsExist = bucketsElement.exists;
  await t.expect(bucketsExist).ok();
});

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "bucketread1");
  })("Browse button exists", async (t) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await t
      .useRole(roles.bucketRead)
      .navigateTo("http://localhost:9090/browser")
      .expect(testBucketBrowseButtonFor("bucketread1").exists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucket(t, "bucketread1");
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "bucketread2");
  })("Bucket access is set to R", async (t) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await t
      .useRole(roles.bucketRead)
      .navigateTo("http://localhost:9090/buckets")
      .expect(
        Selector("h1")
          .withText(`${constants.TEST_BUCKET_NAME}-bucketread2`)
          .parent(1)
          .find("p")
          .nth(-1).innerText
      )
      .eql("Access: R");
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucket(t, "bucketread2");
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "aread3");
    await t
      .useRole(roles.admin)
      .navigateTo("http://localhost:9090/browser")
      .click(testBucketBrowseButtonFor("aread3"))
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt")
      .click(logoutItem);
  })("Object list table is enabled", async (t) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await t
      .useRole(roles.bucketRead)
      .navigateTo("http://localhost:9090/browser")
      .wait(2000)
      .click(testBucketBrowseButtonFor("aread3"))
      .wait(2000)
      .expect(elements.table.exists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucketAndUploads(t, "aread3");
  });
