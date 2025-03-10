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
import { acknowledgeButton } from "../utils/elements";

fixture("For user with Bucket Read & Write permissions").page(
  "http://localhost:9090",
);

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "bucketdelete3");
    await functions.setVersioned(t, "bucketdelete3");
    await t
      .useRole(roles.bucketReadWrite)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, "bucketdelete3")
      .click(testBucketBrowseButtonFor("bucketdelete3"))
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt")
      .wait(1000)
      .navigateTo("http://localhost:9090/browser")
      .click(testBucketBrowseButtonFor("bucketdelete3"))
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt")
      .wait(1000);
  })("All versions of an object can be deleted from a bucket", async (t) => {
    const versionRows = Selector(
      "div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div:nth-child(1)",
    );
    await t
      .useRole(roles.bucketReadWrite)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, "bucketdelete3")
      .click(testBucketBrowseButtonFor("bucketdelete3"))
      .click(
        "div.ReactVirtualized__Grid.ReactVirtualized__Table__Grid > div > div:nth-child(1)",
      )
      .click(elements.deleteButton)
      .click(elements.deleteAllVersions)
      .click(Selector("button:enabled").withExactText("Delete").nth(1))
      .expect(versionRows.exists)
      .notOk();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucketAndUploads(t, "bucketdelete3");
  });
