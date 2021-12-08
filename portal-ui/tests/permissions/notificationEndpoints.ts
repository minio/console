// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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
import * as elements from "../utils/elements";

fixture("For user with Notification Endpoints permissions")
  .page("http://localhost:5005")
  .beforeEach(async (t) => {
    await t.useRole(roles.notificationEndpoints);
  });

test("Notification Endpoints sidebar item exists", async (t) => {
  const notificationEndpointsExist =
    elements.notificationEndpointsElement.exists;
  await t.expect(notificationEndpointsExist).ok();
});

test("Add Notification Target button exists", async (t) => {
  const addNotifTargetButtonExists = elements.addNotifTargetButton.exists;
  await t
    .navigateTo("http://localhost:5005/notification-endpoints")
    .expect(addNotifTargetButtonExists)
    .ok();
});

test("Add Notification Target button is clickable", async (t) => {
  await t
    .navigateTo("http://localhost:5005/notification-endpoints")
    .click(elements.addNotifTargetButton);
});
