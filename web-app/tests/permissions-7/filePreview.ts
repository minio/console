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

fixture("Test Preview page in Console").page("http://localhost:9090/");

const bucketName = "preview";
export const file = Selector(".ReactVirtualized__Table__rowColumn").withText(
  "internode.png",
);
export const fileScript = Selector(
  ".ReactVirtualized__Table__rowColumn",
).withText("filescript.pdf");

export const pdfFile = Selector(".ReactVirtualized__Table__rowColumn").withText(
  "file1.pdf",
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
      .navigateTo(`http://localhost:9090/browser`)
      .click(bucketNameAction)
      .click(file)
      .click(Selector(".objectActions button").withText("Preview"))
      .expect(Selector(".dialogContent > div > img").exists)
      .ok();
  })
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucketName);
  });

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucketName);
    await functions.uploadNamedObjectToBucket(
      t,
      bucketName,
      "file1.pdf",
      "web-app/tests/uploads/file1.pdf",
    );
  })("PDF File can be previewed", async (t) => {
    await t
      .useRole(roles.admin)
      .navigateTo(`http://localhost:9090/browser`)
      .click(bucketNameAction)
      .click(pdfFile)
      .click(Selector(".objectActions button").withText("Preview"))
      .expect(Selector(".react-pdf__Page__canvas").exists)
      .ok();
  })
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucketName);
  });

test
  .before(async (t) => {
    await functions.setUpNamedBucket(t, bucketName);
    await functions.uploadNamedObjectToBucket(
      t,
      bucketName,
      "filescript.pdf",
      "web-app/tests/uploads/filescript.pdf",
    );
  })("PDF with Alert doesn't execute script", async (t) => {
    await t
      .useRole(roles.admin)
      .navigateTo(`http://localhost:9090/browser`)
      .click(bucketNameAction)
      .click(fileScript)
      .click(Selector(".objectActions button").withText("Preview"))
      .setNativeDialogHandler(() => false);

    const history = await t.getNativeDialogHistory();

    await t.expect(history.length).eql(0);
  })
  .after(async (t) => {
    await functions.cleanUpNamedBucketAndUploads(t, bucketName);
  });
