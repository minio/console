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
  namedTestBucketBrowseButtonFor,
  setUpNamedBucket,
  setVersionedBucket,
  testBucketBrowseButtonFor,
} from "../utils/functions";
import { Selector } from "testcafe";
import { deniedError, file } from "../permissions-6/resourceTesting";

fixture("Rewind Testing").page("http://localhost:9090");

const bucketname = "bucketname";
const test3BucketBrowseButton = namedTestBucketBrowseButtonFor(bucketname);

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "abucketrewind");
    await functions.setVersioned(t, "abucketrewind");
    await t
      .useRole(roles.bucketReadWrite)
      .navigateTo("http://localhost:9090/browser")
      .click(testBucketBrowseButtonFor("abucketrewind"))
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt")
      .wait(1000)
      .navigateTo("http://localhost:9090/browser")
      .click(testBucketBrowseButtonFor("abucketrewind"))
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt")
      .wait(1000);
  })("Rewind works in bucket", async (t) => {
    await t
      .useRole(roles.bucketReadWrite)
      .navigateTo("http://localhost:9090/browser")
      .click(testBucketBrowseButtonFor("abucketrewind"))
      .expect(elements.table.exists)
      .ok()
      .click(elements.rewindButton)
      .click(elements.rewindToBaseInput)
      .expect(elements.rewindToInput.exists)
      .ok()
      .click(elements.rewindToInput)
      .typeText(elements.rewindToInput, "01/01/2015 00:00")
      .click(elements.rewindDataButton);
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpBucketAndUploads(t, "abucketrewind");
  });

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucketname);
    await functions.setVersionedBucket(t, bucketname);
    await functions.uploadNamedObjectToBucket(
      t,
      bucketname,
      "test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucketname,
      "firstlevel/secondlevel/test.txt",
      "web-app/tests/uploads/test.txt",
    );
  })("Rewind button enabled in bucket", async (t) => {
    await t
      .useRole(roles.rewindEnabled)
      .navigateTo(`http://localhost:9090/browser`)
      .click(test3BucketBrowseButton)
      .wait(1500)
      .click(
        Selector(".ReactVirtualized__Table__rowColumn").withText("firstlevel"),
      )
      .wait(1500)
      .click(
        Selector(".ReactVirtualized__Table__rowColumn").withText("secondlevel"),
      )
      .wait(1500)
      .expect(elements.rewindButton.exists)
      .ok();
  })
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucketname);
  });

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucketname);
    await functions.setVersionedBucket(t, bucketname);
    await functions.uploadNamedObjectToBucket(
      t,
      bucketname,
      "test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucketname,
      "firstlevel/secondlevel/test.txt",
      "web-app/tests/uploads/test.txt",
    );
  })("Rewind button disabled in bucket", async (t) => {
    await t
      .useRole(roles.rewindNotEnabled)
      .navigateTo(`http://localhost:9090/browser`)
      .click(test3BucketBrowseButton)
      .wait(1500)
      .click(
        Selector(".ReactVirtualized__Table__rowColumn").withText("firstlevel"),
      )
      .wait(1500)
      .click(
        Selector(".ReactVirtualized__Table__rowColumn").withText("secondlevel"),
      )
      .wait(1500)
      .expect(elements.rewindButton.exists)
      .ok()
      .wait(1500)
      .expect(elements.rewindButton.hasAttribute("disabled"))
      .ok();
  })
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucketname);
  });
