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
import {
  namedTestBucketBrowseButtonFor,
  namedManageButtonFor,
} from "../utils/functions";
import { Selector } from "testcafe";
import * as constants from "../utils/constants";

const TEST_BUCKET_NAME_SPECIFIC = "specific-bucket";

fixture("For user with permissions that only allow specific Buckets").page(
  "http://localhost:9090"
);

test("Buckets sidebar item exists", async (t) => {
  const bucketsExist = bucketsElement.with({ boundTestRun: t }).exists;
  await t.useRole(roles.bucketSpecific).expect(bucketsExist).ok();
});

// Bucket assign policy tests

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-1`);
  })("A readonly policy can be assigned to a bucket", async (t) => {
    await t
      // We need to log back in after we use the admin account to create bucket,
      // using the specific role we use in this module
      .useRole(roles.bucketSpecific)
      .navigateTo("http://localhost:9090/buckets")
      .click(namedManageButtonFor(`${TEST_BUCKET_NAME_SPECIFIC}-1`))
      .click(elements.bucketAccessRulesTab)
      .click(elements.addAccessRuleButton)
      .typeText(elements.bucketsPrefixInput, "readonlytest")
      .click(elements.bucketsAccessInput)
      .click(elements.bucketsAccessReadOnlyInput)
      .click(elements.saveButton);
  })
  .after(async (t) => {
    // Cleanup created bucket
    await functions.cleanUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-1`);
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-2`);
  })("A writeonly policy can be assigned to a bucket", async (t) => {
    await t
      // We need to log back in after we use the admin account to create bucket,
      // using the specific role we use in this module
      .useRole(roles.bucketSpecific)
      .navigateTo("http://localhost:9090/buckets")
      .click(namedManageButtonFor(`${TEST_BUCKET_NAME_SPECIFIC}-2`))
      .click(elements.bucketAccessRulesTab)
      .click(elements.addAccessRuleButton)
      .typeText(elements.bucketsPrefixInput, "writeonlytest")
      .click(elements.bucketsAccessInput)
      .click(elements.bucketsAccessWriteOnlyInput)
      .click(elements.saveButton);
  })
  .after(async (t) => {
    // Cleanup created bucket
    await functions.cleanUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-2`);
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-3`);
  })("A readwrite policy can be assigned to a bucket", async (t) => {
    await t
      // We need to log back in after we use the admin account to create bucket,
      // using the specific role we use in this module
      .useRole(roles.bucketSpecific)
      .navigateTo("http://localhost:9090/buckets")
      .click(namedManageButtonFor(`${TEST_BUCKET_NAME_SPECIFIC}-3`))
      .click(elements.bucketAccessRulesTab)
      .click(elements.addAccessRuleButton)
      .typeText(elements.bucketsPrefixInput, "readwritetest")
      .click(elements.bucketsAccessInput)
      .click(elements.bucketsAccessReadWriteInput)
      .click(elements.saveButton);
  })
  .after(async (t) => {
    // Cleanup created bucket
    await functions.cleanUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-3`);
  });

// Bucket read tests

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-4`);
  })("Browse button exists", async (t) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await t
      .useRole(roles.bucketRead)
      .navigateTo("http://localhost:9090/browser")
      .expect(
        namedTestBucketBrowseButtonFor(`${TEST_BUCKET_NAME_SPECIFIC}-4`).exists
      )
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-4`);
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-5`);
  })("Bucket access is set to R", async (t) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await t
      .useRole(roles.bucketRead)
      .navigateTo("http://localhost:9090/buckets")
      .expect(
        Selector("h1")
          .withText(`${TEST_BUCKET_NAME_SPECIFIC}-5`)
          .parent(1)
          .find("p")
          .nth(-1).innerText
      )
      .eql("Access: R");
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-5`);
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-6`);
    await t
      .useRole(roles.admin)
      .navigateTo("http://localhost:9090/browser")
      .click(namedTestBucketBrowseButtonFor(`${TEST_BUCKET_NAME_SPECIFIC}-6`))
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt")
      .click(logoutItem);
  })("Object list table is enabled", async (t) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await t
      .useRole(roles.bucketRead)
      .navigateTo("http://localhost:9090/browser")
      .click(namedTestBucketBrowseButtonFor(`${TEST_BUCKET_NAME_SPECIFIC}-6`))
      .expect(elements.table.exists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucketAndUploads(
      t,
      `${TEST_BUCKET_NAME_SPECIFIC}-6`
    );
  });

// Bucket write tests

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-7`);
  })("Browse button exists", async (t) => {
    const testBucketBrowseButton = namedTestBucketBrowseButtonFor(
      `${TEST_BUCKET_NAME_SPECIFIC}-7`
    );
    await t
      .useRole(roles.bucketSpecific)
      .navigateTo("http://localhost:9090/browser")
      .expect(testBucketBrowseButton.exists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucketAndUploads(
      t,
      `${TEST_BUCKET_NAME_SPECIFIC}-7`
    );
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-8`);
  })("Bucket access is set to R/W", async (t) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await t
      .useRole(roles.bucketSpecific)
      .navigateTo("http://localhost:9090/buckets")
      .expect(
        Selector("h1")
          .withText(`${TEST_BUCKET_NAME_SPECIFIC}-8`)
          .parent(1)
          .find("p")
          .nth(-1).innerText
      )
      .eql("Access: R/W");
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucketAndUploads(
      t,
      `${TEST_BUCKET_NAME_SPECIFIC}-8`
    );
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-9`);
  })("Upload button exists", async (t) => {
    const uploadExists = elements.uploadButton.exists;
    const testBucketBrowseButton = namedTestBucketBrowseButtonFor(
      `${TEST_BUCKET_NAME_SPECIFIC}-9`
    );
    await t
      .useRole(roles.bucketSpecific)
      .navigateTo("http://localhost:9090/browser")
      .click(testBucketBrowseButton)
      .expect(uploadExists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucketAndUploads(
      t,
      `${TEST_BUCKET_NAME_SPECIFIC}-9`
    );
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-10`);
  })("Object can be uploaded to a bucket", async (t) => {
    const testBucketBrowseButton = namedTestBucketBrowseButtonFor(
      `${TEST_BUCKET_NAME_SPECIFIC}-10`
    );
    await t
      .useRole(roles.bucketSpecific)
      .navigateTo("http://localhost:9090/browser")
      .click(testBucketBrowseButton)
      // Upload object to bucket
      .setFilesToUpload(elements.uploadInput, "../uploads/test.txt");
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucketAndUploads(
      t,
      `${TEST_BUCKET_NAME_SPECIFIC}-10`
    );
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpNamedBucket(t, `${TEST_BUCKET_NAME_SPECIFIC}-11`);
  })("Object list table is disabled", async (t) => {
    await t
      .useRole(roles.bucketSpecific)
      .navigateTo("http://localhost:9090/browser")
      .click(namedTestBucketBrowseButtonFor(`${TEST_BUCKET_NAME_SPECIFIC}-11`))
      .expect(elements.bucketsTableDisabled.exists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket and corresponding uploads
    await functions.cleanUpNamedBucketAndUploads(
      t,
      `${TEST_BUCKET_NAME_SPECIFIC}-11`
    );
  });
