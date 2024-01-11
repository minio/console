// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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
import { Selector } from "testcafe";
import * as functions from "../utils/functions";
import { namedTestBucketBrowseButtonFor } from "../utils/functions";

fixture("Test error visibility in Object Browser Navigation").page(
  "http://localhost:9090/",
);

const bucketName = "my-company";
const bucketName2 = "my-company2";
const bucketBrowseButton = namedTestBucketBrowseButtonFor(bucketName);
const bucketBrowseButton2 = namedTestBucketBrowseButtonFor(bucketName2);
export const file = Selector(".ReactVirtualized__Table__rowColumn").withText(
  "test.txt",
);
export const deniedError =
  Selector(".messageTruncation").withText("Access Denied.");

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucketName);
    await functions.uploadNamedObjectToBucket(
      t,
      bucketName,
      "test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucketName,
      "home/UserY/test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucketName,
      "home/UserX/test.txt",
      "web-app/tests/uploads/test.txt",
    );
  })(
    "Error Notification is shown in Object Browser when no privileges are set",
    async (t) => {
      await t
        .useRole(roles.conditions3)
        .navigateTo(`http://localhost:9090/browser`)
        .click(bucketBrowseButton)
        .click(Selector(".ReactVirtualized__Table__rowColumn").withText("home"))
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText("UserX"),
        )
        .expect(deniedError.exists)
        .ok();
    },
  )
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucketName);
  });

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucketName2);
    await functions.setVersionedBucket(t, bucketName2);
    await functions.uploadNamedObjectToBucket(
      t,
      bucketName2,
      "test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucketName2,
      "home/UserY/test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucketName2,
      "home/UserX/test.txt",
      "web-app/tests/uploads/test.txt",
    );
  })(
    "Error Notification is shown in Object Browser with Rewind request set",
    async (t) => {
      await t
        .useRole(roles.conditions4)
        .navigateTo(`http://localhost:9090/browser`)
        .click(bucketBrowseButton2)
        .click(Selector("label").withText("Show deleted objects"))
        .wait(1500)
        .click(Selector(".ReactVirtualized__Table__rowColumn").withText("home"))
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText("UserX"),
        )
        .expect(deniedError.exists)
        .ok();
    },
  )
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucketName2);
  });
