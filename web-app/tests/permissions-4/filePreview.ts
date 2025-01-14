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
import * as elements from "../utils/elements";
import { acknowledgeButton } from "../utils/elements";

fixture("Test Preview page in Console").page("http://localhost:9090/");

const bucketName = "preview";
export const file = Selector(".ReactVirtualized__Table__rowColumn").withText(
  "internode.png",
);

const bucketNameAction = namedTestBucketBrowseButtonFor(bucketName);

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucketName);
    await functions.uploadNamedObjectToBucket(
      t,
      bucketName,
      "internode.png",
      "web-app/tests/uploads/internode.png",
    );
  })("File can be previewed", async (t) => {
    await t
      .useRole(roles.admin)
      .click(acknowledgeButton)
      .typeText(elements.filterBuckets, bucketName)
      .click(bucketNameAction)
      .click(file)
      .click(Selector(".objectActions button").withText("Preview"))
      .expect(Selector(".dialogContent > div > img").exists)
      .ok();
  })
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucketName);
  });
