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
import { Selector } from "testcafe";
import { acknowledgeButton } from "../utils/elements";

fixture("For user with Bucket Write to specific prefix permissions").page(
  "http://localhost:9090",
);

test
  .before(async (t) => {})(
    "Upload File button is disable and Upload Folder button is enabled on bucket root path",
    async (t) => {
      const uploadButton = elements.uploadButton;

      await t
        .useRole(roles.bucketWritePrefixOnly)
        .navigateTo("http://localhost:9090/browser/testcafe")
        .click(acknowledgeButton)
        .click(uploadButton)
        .expect(
          Selector("div")
            .withAttribute("label", "Upload File")
            .hasClass("disabled"),
        )
        .ok()
        .expect(
          Selector("div")
            .withAttribute("label", "Upload Folder")
            .hasClass("disabled"),
        )
        .notOk();
    },
  )
  .after(async (t) => {});

test
  .before(async (t) => {})(
    "Upload File and Folder buttons are enabled on bucket prefix path",
    async (t) => {
      const uploadButton = elements.uploadButton;

      await t
        .useRole(roles.bucketWritePrefixOnly)
        .navigateTo("http://localhost:9090/browser/testcafe/write")
        .click(acknowledgeButton)
        .click(uploadButton)
        .expect(
          Selector("div")
            .withAttribute("label", "Upload File")
            .hasClass("disabled"),
        )
        .notOk()
        .expect(
          Selector("div")
            .withAttribute("label", "Upload Folder")
            .hasClass("disabled"),
        )
        .notOk();
    },
  )
  .after(async (t) => {});
