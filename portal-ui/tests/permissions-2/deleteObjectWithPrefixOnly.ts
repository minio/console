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
import { Selector } from "testcafe";
import * as functions from "../utils/functions";
import { testBucketBrowseButtonFor } from "../utils/functions";

fixture("Delete Objects With Prefix Only policy").page(
  "http://localhost:9090/"
);

export const sideBar = Selector("div.MuiGrid-root.MuiGrid-item");
export const sideBarDeleteButton = sideBar.find("button").withText("Delete");
const bucket1 = "test-1";
const test1BucketBrowseButton = testBucketBrowseButtonFor(bucket1);
const bucket2 = "test-2";
const test2BucketBrowseButton = testBucketBrowseButtonFor(bucket2);
const bucket3 = "test-3";
const test3BucketBrowseButton = testBucketBrowseButtonFor(bucket3);
test
  .before(async (t) => {
    await functions.setUpBucket(t, bucket1);
    await functions.uploadObjectToBucket(
      t,
      bucket1,
      "test.txt",
      "portal-ui/tests/uploads/test.txt"
    );
  })("Delete button is disabled for object inside bucket", async (t) => {
    await t
      .useRole(roles.deleteObjectWithPrefixOnly)
      .navigateTo(`http://localhost:9090/browser`)
      .click(test1BucketBrowseButton)
      .click(
        Selector(".ReactVirtualized__Table__rowColumn").withText("test.txt")
      )
      .expect(sideBarDeleteButton.hasAttribute("disabled"))
      .ok();
  })
  .after(async (t) => {
    await functions.cleanUpBucketAndUploads(t, bucket1);
  });

test
  .before(async (t) => {
    await functions.setUpBucket(t, bucket2);
    await functions.uploadObjectToBucket(
      t,
      bucket2,
      "digitalinsights/xref_cust_guid_actd-v1.txt",
      "portal-ui/tests/uploads/test.txt"
    );
  })(
    "Delete button is enabled for object that matches prefix inside bucket",
    async (t) => {
      await t
        .useRole(roles.deleteObjectWithPrefixOnly)
        .navigateTo(`http://localhost:9090/browser`)
        .click(test2BucketBrowseButton)
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText(
            "digitalinsights"
          )
        )
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText(
            "xref_cust_guid_actd-v1.txt"
          )
        )
        .expect(sideBarDeleteButton.hasAttribute("disabled"))
        .notOk();
    }
  )
  .after(async (t) => {
    await functions.cleanUpBucketAndUploads(t, bucket2);
  });

test
  .before(async (t) => {
    await functions.setUpBucket(t, bucket3);
    await functions.uploadObjectToBucket(
      t,
      bucket3,
      "digitalinsights/test.txt",
      "portal-ui/tests/uploads/test.txt"
    );
  })(
    "Delete button is disabled for object that doesn't matches prefix inside bucket",
    async (t) => {
      await t
        .useRole(roles.deleteObjectWithPrefixOnly)
        .navigateTo(`http://localhost:9090/browser`)
        .click(test3BucketBrowseButton)
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText(
            "digitalinsights"
          )
        )
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText("test.txt")
        )
        .expect(sideBarDeleteButton.hasAttribute("disabled"))
        .ok();
    }
  )
  .after(async (t) => {
    await functions.cleanUpBucketAndUploads(t, bucket3);
  });
