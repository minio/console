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
import * as elements from "../utils/elements-menu";
import {
  bucketsElement,
  dashboardElement,
  groupsElement,
  iamPoliciesElement,
  identityElement,
  monitoringElement,
  notificationEndpointsElement,
  serviceAcctsElement,
  tiersElement,
  usersElement,
} from "../utils/elements-menu";

fixture("For user with Admin permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.admin);
  });

test("All sidebar items exist", async (t) => {
  const licenseExists = elements.licenseElement.exists;
  await t
    .expect(monitoringElement.exists)
    .ok()
    .click(monitoringElement)
    .expect(dashboardElement.exists)
    .ok()
    .expect(bucketsElement.exists)
    .ok()
    .expect(identityElement.exists)
    .ok()
    .click(identityElement)
    .expect(usersElement.exists)
    .ok()
    .expect(groupsElement.exists)
    .ok()
    .expect(serviceAcctsElement.exists)
    .ok()
    .expect(iamPoliciesElement.exists)
    .ok()
    .expect(notificationEndpointsElement.exists)
    .ok()
    .expect(tiersElement.exists)
    .ok()
    .expect(elements.diagnosticsElement.exists)
    .ok()
    .expect(elements.performanceElement.exists)
    .ok()
    .expect(licenseExists)
    .ok();
});
