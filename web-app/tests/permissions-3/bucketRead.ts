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
import { logoutItem } from "../utils/elements-menu";
import { testBucketBrowseButtonFor } from "../utils/functions";
import { acknowledgeButton } from "../utils/elements";

fixture("For user with Bucket Read permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.bucketRead);
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "bucketread1");
  })("Browse button exists", async (t) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await t
      .useRole(roles.bucketRead)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, "bucketread1")
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
    await functions.setUpBucket(t, "aread3");
    await t
      .useRole(roles.admin)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, "aread3")
      .click(testBucketBrowseButtonFor("aread3"))
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt")
      .click(logoutItem);
  })("Object list table is enabled", async (t) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await t
      .useRole(roles.bucketRead)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, "aread3")
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
