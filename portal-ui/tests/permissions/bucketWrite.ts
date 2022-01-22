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

fixture("For user with Bucket Write permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.bucketWrite);
  });

test("Buckets sidebar item exists", async (t) => {
  const bucketsExist = bucketsElement.with({ boundTestRun: t }).exists;
  await t.expect(bucketsExist).ok();
});

test.before(async (t) => {
  // Create a bucket
  await functions.setUpBucket(t, "bucketwrite");
})("Browse button exists", async (t) => {
  const testBucketBrowseButton = testBucketBrowseButtonFor("bucketwrite");
  const browseExists = testBucketBrowseButton.exists;
  await t
    // We need to log back in after we use the admin account to create bucket,
    // using the specific role we use in this module
    .useRole(roles.bucketWrite)
    .navigateTo("http://localhost:9090/buckets")
    .expect(browseExists)
    .ok();
});

test("Bucket access is set to W", async (t) => {
  await t
    .navigateTo("http://localhost:9090/buckets")
    .expect(elements.bucketAccessText.innerText)
    .eql("Access: W");
});

test("Upload button exists", async (t) => {
  const uploadExists = elements.uploadButton.exists;
  const testBucketBrowseButton = testBucketBrowseButtonFor("bucketwrite");
  await t
    .navigateTo("http://localhost:9090/buckets")
    .click(testBucketBrowseButton)
    .expect(uploadExists)
    .ok();
});

test("Object can be uploaded to a bucket", async (t) => {
  const testBucketBrowseButton = testBucketBrowseButtonFor("bucketwrite");
  await t
    .navigateTo("http://localhost:9090/buckets")
    .click(testBucketBrowseButton)
    // Upload object to bucket
    .setFilesToUpload(elements.uploadInput, "../uploads/test.txt");
});

test("Object list table is disabled", async (t) => {
  const disabledBucketsTableExists = elements.bucketsTableDisabled.exists;
  const testBucketBrowseButton = testBucketBrowseButtonFor("bucketwrite");
  await t
    .navigateTo("http://localhost:9090/buckets")
    .click(testBucketBrowseButton)
    .expect(disabledBucketsTableExists)
    .ok();
}).after(async (t) => {
  // Cleanup created bucket and corresponding uploads
  await functions.cleanUpBucketAndUploads(t, "bucketwrite");
});
