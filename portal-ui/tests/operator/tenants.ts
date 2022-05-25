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

import { Selector } from "testcafe";

fixture("For user with default permissions").page("http://localhost:9090");

test("Create Tenant and List Tenants", async (t) => {
  const tenantName = `tenant-${Math.floor(Math.random() * 10000)}`;

  await t
    .navigateTo("http://localhost:9090/login")
    .typeText("#jwt", "anyrandompasswordwillwork")
    .click("#do-login")
    .click("#create-tenant")
    .typeText("#tenant-name", tenantName)
    .typeText("#namespace", tenantName)
    .click("#add-namespace")
    .click("#confirm-ok")
    .wait(1000)
    .click("#wizard-button-Create")
    .wait(1000)
    .click("#close")
    .expect(Selector(`#list-tenant-${tenantName}`).exists)
    .ok();
});

test("Create Tenant Without Audit Log", async (t) => {
  const tenantName = `tenant-${Math.floor(Math.random() * 10000)}`;

  await t
    .navigateTo("http://localhost:9090/login")
    .typeText("#jwt", "anyrandompasswordwillwork")
    .click("#do-login")
    .click("#create-tenant")
    .typeText("#tenant-name", tenantName)
    .typeText("#namespace", tenantName)
    .click("#add-namespace")
    .click("#confirm-ok")
    .wait(1000)
    .click("#wizard-step-audit-log")
    .click("#enableLogging")
    .click("#wizard-button-Create")
    .wait(1000)
    .click("#close")
    .expect(Selector(`#list-tenant-${tenantName}`).exists)
    .ok();
});
