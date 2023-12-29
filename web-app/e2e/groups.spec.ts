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

import { expect } from "@playwright/test";
import { generateUUID, test } from "./fixtures/baseFixture";
import { minioadminFile } from "./consts";
import { BUCKET_LIST_PAGE } from "./consts";

test.use({ storageState: minioadminFile });

test.beforeEach(async ({ page }) => {
  await page.goto(BUCKET_LIST_PAGE);
});

test("Add a new group", async ({ page }) => {
  await page.getByRole("button", { name: "Identity" }).click();
  await page.getByRole("button", { name: "Groups" }).click();
  await page.getByRole("button", { name: "Create Group" }).click();

  const groupName = `new-group-${generateUUID()}`;

  await page.getByLabel("Group Name").fill(groupName);
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("gridcell", { name: groupName })).toBeTruthy();
});
