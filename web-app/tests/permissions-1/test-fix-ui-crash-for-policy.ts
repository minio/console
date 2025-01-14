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

import { Role, Selector } from "testcafe";
import { readFileSync } from "fs";
import { getMenuElement } from "../utils/elements-menu";

const data = readFileSync(__dirname + "/../constants/timestamp.txt", "utf-8");
const $TIMESTAMP = data.trim();

let testDomainUrl = "http://localhost:9090";

let insAllowedAccKey = `prefix-policy-ui-crash-${$TIMESTAMP}`;
let insAllowedSeckey = "poluicrashfix1234";

/* Begin Local Testing config block */

// For local Testing Create users and assign policies then update here.
// Command to invoke the test locally: testcafe chrome tests/permissions/inspect.ts
/*testDomainUrl = "http://localhost:5005";
insAllowedAccKey = `prefix-policy-ui-crash`;
insAllowedSeckey = "poluicrashfix1234";*/
/* End Local Testing config block */

const loginUrl = `${testDomainUrl}/login`;
const bucketsScreenUrl = `${testDomainUrl}/buckets`;

const loginSubmitBtn = Selector("button").withAttribute("id", "do-login");

export const bucketsSidebarEl = getMenuElement("buckets");

export const inspectAllowedRole = Role(
  loginUrl,
  async (t) => {
    await t
      .typeText("#accessKey", insAllowedAccKey)
      .typeText("#secretKey", insAllowedSeckey)
      .click(loginSubmitBtn);
  },
  { preserveUrl: true },
);

fixture("For user with Bucket Prefix permissions")
  .page(testDomainUrl)
  .beforeEach(async (t) => {
    await t.useRole(inspectAllowedRole);
  });

test("Bucket page can be opened", async (t) => {
  await t.navigateTo(bucketsScreenUrl);
});

/**
 * Without the fix UI crashes with
 * TypeError: simpleResources is not iterable (if fixed -> )
 * TypeError: scopes is not iterable  (if fixed -> )
 * TypeError: values is not iterable
 */
