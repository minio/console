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
import { Selector } from "testcafe";

fixture("For user with Bucket Read & Write permissions").page(
  "http://localhost:9090"
);

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "bucketobjecttags");
    await functions.setVersioned(t, "bucketobjecttags");
  })("Tags can be created and deleted", async (t) => {
    const testBucketBrowseButton =
      testBucketBrowseButtonFor("bucketobjecttags");
    await t
      .useRole(roles.bucketObjectTags)
      .navigateTo("http://localhost:9090/buckets")
      .click(testBucketBrowseButton)
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt")
      .wait(1000)
      .click(
        "div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div:nth-child(1)"
      )
      .click(Selector("button").withText("Tags"))
      .typeText("#newTagKey", "tag1")
      .typeText("#newTagLabel", "test")
      .click(Selector("button:enabled").withText("Save New Tag"))
      .click(Selector("button").withText("Tags"))
      .expect(Selector(".MuiChip-label").withText("tag1 : test").exists)
      .ok()
      .click(Selector(".MuiChip-deleteIcon"))
      .click(Selector("button").withText("Yes"))
      .click(Selector("button").withText("Tags"))
      .expect(Selector(".MuiChip-label").withText("tag1 : test").exists)
      .notOk();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucketAndUploads(t, "bucketobjecttags");
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "bucketcannottag");
    await functions.setVersioned(t, "bucketcannottag");
  })("User should not be able to create tag", async (t) => {
    const testBucketBrowseButton = testBucketBrowseButtonFor("bucketcannottag");
    await t
      .useRole(roles.bucketCannotTag)
      .navigateTo("http://localhost:9090/buckets")
      .click(testBucketBrowseButton)
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt")
      .wait(1000)
      .click(
        "div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div:nth-child(1)"
      )
      .click(Selector("button").withText("Tags"))
      .typeText("#newTagKey", "tag1")
      .typeText("#newTagLabel", "test")
      .click(Selector("button:enabled").withText("Save New Tag"))
      .click(Selector("button").withText("Tags"))
      .expect(Selector(".MuiChip-label").withText("tag1 : test").exists)
      .notOk();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucketAndUploads(t, "bucketcannottag");
  });
