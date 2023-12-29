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
import { test as setup } from "@playwright/test";
import { adminAccessKey, adminSecretKey, minioadminFile } from "./consts";
import { BUCKET_LIST_PAGE } from "./consts";

setup("authenticate as admin", async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto(BUCKET_LIST_PAGE);
  await page.getByPlaceholder("Username").click();
  await page.getByPlaceholder("Username").fill(adminAccessKey);
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").fill(adminSecretKey);
  await page.getByRole("button", { name: "Login" }).click();

  // we need to give the browser time to store the cookies
  await page.waitForTimeout(1000);
  // End of authentication steps.

  await page.context().storageState({ path: minioadminFile });
});
