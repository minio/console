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
import {
  cleanUpNamedBucketAndUploads,
  namedTestBucketBrowseButtonFor,
} from "../utils/functions";

fixture("Test resources policy").page("http://localhost:9090/");

const bucket1 = "testcondition";
const bucket3 = "my-company";
const test1BucketBrowseButton = namedTestBucketBrowseButtonFor(bucket1);
const test3BucketBrowseButton = namedTestBucketBrowseButtonFor(bucket3);
export const file = Selector(".ReactVirtualized__Table__rowColumn").withText(
  "test.txt",
);
export const deniedError =
  Selector(".messageTruncation").withText("Access Denied.");

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucket1);
    await functions.uploadNamedObjectToBucket(
      t,
      bucket1,
      "test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucket1,
      "firstlevel/test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucket1,
      "firstlevel/secondlevel/test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucket1,
      "firstlevel/secondlevel/thirdlevel/test.txt",
      "web-app/tests/uploads/test.txt",
    );
  })(
    "User can only see permitted files in last path as expected",
    async (t) => {
      await t
        .useRole(roles.conditions2)
        .navigateTo(`http://localhost:9090/browser`)
        .click(test1BucketBrowseButton)
        .wait(1500)
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText(
            "firstlevel",
          ),
        )
        .wait(1500)
        .expect(file.exists)
        .notOk()
        .wait(1500)
        .click(
          Selector(".ReactVirtualized__Table__rowColumn").withText(
            "secondlevel",
          ),
        )
        .wait(1500)
        .expect(file.exists)
        .notOk();
    },
  )
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucket1);
  });

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucket1);
    await functions.uploadNamedObjectToBucket(
      t,
      bucket1,
      "test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucket1,
      "firstlevel/test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucket1,
      "firstlevel/secondlevel/test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucket1,
      "firstlevel/secondlevel/thirdlevel/test.txt",
      "web-app/tests/uploads/test.txt",
    );
  })("User can browse from first level as policy has wildcard", async (t) => {
    await t
      .useRole(roles.conditions1)
      .navigateTo(`http://localhost:9090/browser`)
      .click(test1BucketBrowseButton)
      .wait(1500)
      .click(
        Selector(".ReactVirtualized__Table__rowColumn").withText("firstlevel"),
      )
      .wait(1500)
      .expect(file.exists)
      .ok()
      .wait(1500)
      .click(
        Selector(".ReactVirtualized__Table__rowColumn").withText("secondlevel"),
      )
      .wait(1500)
      .expect(file.exists)
      .ok()
      .wait(1500)
      .click(
        Selector(".ReactVirtualized__Table__rowColumn").withText("thirdlevel"),
      )
      .wait(1500)
      .expect(file.exists)
      .ok();
  })
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucket1);
  });

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucket3);
    await functions.uploadNamedObjectToBucket(
      t,
      bucket3,
      "test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucket3,
      "home/UserY/test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucket3,
      "home/UserX/test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucket3,
      "home/User/test.txt",
      "web-app/tests/uploads/test.txt",
    );
    await functions.uploadNamedObjectToBucket(
      t,
      bucket3,
      "home/User/secondlevel/thirdlevel/test.txt",
      "web-app/tests/uploads/test.txt",
    );
  })("User can browse from sub levels as policy has wildcard", async (t) => {
    await t
      .useRole(roles.conditions3)
      .navigateTo(`http://localhost:9090/browser`)
      .click(test3BucketBrowseButton)
      .wait(1500)
      .click(Selector(".ReactVirtualized__Table__rowColumn").withText("home"))
      .wait(1500)
      .click(Selector(".ReactVirtualized__Table__rowColumn").withText("User"))
      .wait(1500)
      .expect(file.exists)
      .ok()
      .click(
        Selector(".ReactVirtualized__Table__rowColumn").withText("secondlevel"),
      )
      .wait(1500)
      .click(
        Selector(".ReactVirtualized__Table__rowColumn").withText("thirdlevel"),
      )
      .wait(1500)
      .expect(file.exists)
      .ok()
      .navigateTo(`http://localhost:9090/browser`)
      .click(test3BucketBrowseButton)
      .wait(1500)
      .click(Selector(".ReactVirtualized__Table__rowColumn").withText("home"))
      .wait(1500)
      .click(Selector(".ReactVirtualized__Table__rowColumn").withText("UserX"))
      .expect(deniedError.exists)
      .ok();
  })
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucket3);
  });
