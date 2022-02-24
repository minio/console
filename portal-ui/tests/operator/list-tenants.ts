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

import { diagnosticsElement, supportElement } from "../utils/elements-menu";
import { Selector } from "testcafe";

fixture("For user with default permissions").page("http://localhost:9090");

test("Create Tenant and List Tenants", async (t) => {
  const osCount = Selector(
    `#root > div > main > div[class] > div > div > div > div:nth-child(1) > div > div > div`
  ).count;

  await t
    .navigateTo("http://localhost:9090/login")
    .typeText("#jwt", "anyrandompasswordwillwork")
    .click("button.MuiButton-root")
    .click(
      Selector('button[tabindex="0"][type="button"]').withText("Create Tenant")
    )
    .typeText("#tenant-name", "thufeb1754epm")
    .typeText("#namespace", "default")
    .wait(2000)
    .click('button[tabindex="0"]:nth-of-type(2)')
    .click(Selector('button[tabindex="0"][type="button"]').withText("Done"))
    .expect(osCount)
    .eql(2);
});
