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
import { monitoringElement, supportElement } from "../utils/elements-menu";

fixture("For user with Admin permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.admin);
  });

test("All sidebar items exist", async (t) => {
  const monitoring = elements.monitoringElement;
  const identity = elements.identityElement;

  const dashboardExists = elements.dashboardElement.exists;
  const bucketsExist = elements.bucketsElement.exists;
  const usersExist = elements.usersElement.exists;
  const groupsExist = elements.groupsElement.exists;
  const serviceAcctsExist = elements.serviceAcctsElement.exists;
  const iamPoliciesExist = elements.iamPoliciesElement.exists;
  const settingsExist = elements.settingsElement.exists;
  const notificationEndpointsExist =
    elements.notificationEndpointsElement.exists;
  const tiersExist = elements.tiersElement.exists;
  const toolsExist = elements.supportElement.exists;
  const licenseExists = elements.licenseElement.exists;
  await t
    .expect(monitoring.exists)
    .ok()
    .click(monitoring)
    .expect(dashboardExists)
    .ok()
    .expect(bucketsExist)
    .ok()
    .expect(identity.exists)
    .ok()
    .click(identity)
    .expect(usersExist)
    .ok()
    .expect(groupsExist)
    .ok()
    .expect(serviceAcctsExist)
    .ok()
    .expect(iamPoliciesExist)
    .ok()
    .expect(settingsExist)
    .ok()
    .expect(notificationEndpointsExist)
    .ok()
    .expect(tiersExist)
    .ok()
    .expect(supportElement.exists)
    .ok()
    .click(supportElement)
    .expect(elements.registerElement.exists)
    .ok()
    .expect(elements.diagnosticsElement.exists)
    .ok()
    .expect(elements.performanceElement.exists)
    .ok()
    .expect(licenseExists)
    .ok();
});
