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
import { IAM_PAGES } from "../../src/common/SecureComponent/permissions";
import { Selector } from "testcafe";
import { getMenuElement } from "../utils/elements-menu";

let testDomainUrl = "http://localhost:9090";
const screenUrl = `${testDomainUrl}${IAM_PAGES.SITE_REPLICATION}`;
const siteReplicationEl = getMenuElement("sitereplication");
export const addSitesBtn = Selector("button").withText("Add Sites");

/* Begin Local Testing config block */
// For local Testing Create users and assign policies then update here.
// Command to invoke the test locally: testcafe chrome tests/permissions/site-replication.ts
/* End Local Testing config block */

fixture("Site Replication Status for user with Admin permissions")
  .page(testDomainUrl)
  .beforeEach(async (t) => {
    await t.useRole(roles.settings);
  });

test("Site replication sidebar item exists", async (t) => {
  await t.expect(siteReplicationEl.exists).ok();
});

test("Add Sites button exists", async (t) => {
  const addSitesBtnExists = addSitesBtn.exists;
  await t.navigateTo(screenUrl).expect(addSitesBtnExists).ok();
});

test("Add Sites button is clickable", async (t) => {
  await t.navigateTo(screenUrl).click(addSitesBtn);
});
