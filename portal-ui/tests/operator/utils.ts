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

import { Selector, t } from 'testcafe';


export const loginToOperator = async () => {
    await t
        .navigateTo("http://localhost:9090/login")
        .typeText("#jwt", "anyrandompasswordwillwork")
        .click("#do-login");
}

export const createTenant = async (tenantName: string) => {
    await fillTenantInformation(tenantName);
    await t.click("#wizard-button-Create");
    await checkTenantExists(tenantName);
}
    
export const createTenantWithoutAuditLog = async (tenantName) => {
    await fillTenantInformation(tenantName);
    await t
    .click("#wizard-step-audit-log")
    .click("#enableLogging")
    .click("#wizard-button-Create");
    await checkTenantExists(tenantName);
}
    
const fillTenantInformation = async (tenantName: string) => {
    await t
        .click("#create-tenant")
        .typeText("#tenant-name", tenantName)
        .typeText("#namespace", tenantName)
        .click("#add-namespace")
        .click("#confirm-ok")
        .wait(1000);
}

const checkTenantExists = async (tenantName) => {
    await t
        .wait(1000)
        .click("#close")
        .expect(Selector(`#list-tenant-${tenantName}`).exists)
        .ok();
    }
    

export const deleteTenant = async (tenantName: string) => {
    await goToTenant(tenantName);
    await t
        .click("#delete-tenant")
        .typeText("#retype-tenant", tenantName)
        .click("#confirm-ok")
        .expect(Selector(`#list-tenant-${tenantName}`).exists)
        .notOk();
}


const goToTenant = async (tenantName) => {
    await t.click(Selector(`#list-tenant-${tenantName}`))
}

