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
import { testBucketBrowseButtonFor } from "../utils/functions";
import { acknowledgeButton } from "../utils/elements";

fixture("For user with Bucket Write permissions").page("http://localhost:9090");

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "bucketwrite2");
  })("Upload button exists", async (t) => {
    const uploadExists = elements.uploadButton.exists;
    const testBucketBrowseButton = testBucketBrowseButtonFor("bucketwrite2");
    await t
      .useRole(roles.bucketWrite)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, "bucketwrite2")
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
    await t
      .useRole(roles.bucketWrite)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, "bucketwrite3")
      .click(testBucketBrowseButtonFor("bucketwrite3"))
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
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, "bucketwrite4")
      .click(testBucketBrowseButtonFor("bucketwrite4"))
      .expect(elements.bucketsTableDisabled.exists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucketAndUploads(t, "bucketwrite4");
  });
