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

fixture("Test resources policy").page("http://localhost:9090/");

const bucketName = "bucket-with-dash";
const testBucketBrowseButton = namedTestBucketBrowseButtonFor(bucketName);
export const file = Selector(".ReactVirtualized__Table__rowColumn").withText(
  "test.txt",
);

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucketName);
    await functions.setVersionedBucket(t, bucketName);
    await functions.uploadNamedObjectToBucket(
      t,
      bucketName,
      `firstlevel/secondlevel/${bucketName}/otherlevel/test.txt`,
      "web-app/tests/uploads/test.txt",
    );
  })(
    "User can navigate through folders with the same bucket name",
    async (t) => {
      await t
        .useRole(roles.admin)
        .navigateTo(`http://localhost:9090/browser`)
        .click(testBucketBrowseButton)
        .wait(1500)
        .click(Selector("label").withText("Show deleted objects"))
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText(
            "firstlevel",
          ),
        )
        .wait(1500)
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText(
            "secondlevel",
          ),
        )
        .wait(1500)
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText(bucketName),
        )
        .wait(1500)
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText(
            "otherlevel",
          ),
        )
        .wait(1500)
        .expect(file.exists)
        .ok();
    },
  )
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucketName);
  });
