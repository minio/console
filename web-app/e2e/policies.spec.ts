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

test("Can create a policy", async ({ page }) => {
  await page.getByRole("button", { name: "Policies" }).click();
  await page.getByRole("button", { name: "Create Policy" }).click();
  await page.getByLabel("Policy Name").click();

  const policyName = `policy-${generateUUID()}`;

  await page.getByLabel("Policy Name").fill(policyName);
  await page.locator("#code_wrapper").click();
  await page.locator("#code_wrapper").click();
  await page.locator("#code_wrapper").click();
  await page.locator("#code_wrapper").press("Meta+a");
  await page
    .locator("#code_wrapper")
    .fill(
      '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": [\n        "s3:*"\n      ],\n      "Resource": [\n        "arn:aws:s3:::bucket1/*",\n        "arn:aws:s3:::bucket2/*",\n        "arn:aws:s3:::bucket3/*",\n        "arn:aws:s3:::bucket4/*"\n      ]\n    },\n    {\n      "Effect": "Deny",\n      "Action": [\n        "s3:DeleteBucket"\n      ],\n      "Resource": [\n        "arn:aws:s3:::*"\n      ]\n    }\n  ]\n}\n',
    );
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByRole("gridcell", { name: policyName })).toBeTruthy();
});
