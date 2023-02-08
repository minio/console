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
import * as elements from "../utils/elements";
import { bucketDropdownOptionFor } from "../utils/elements";
import * as functions from "../utils/functions";
import { drivesElement, monitoringElement } from "../utils/elements-menu";

fixture("For user with Heal permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.heal);
  });

test("Monitoring sidebar item exists", async (t) => {
  await t.expect(monitoringElement.exists).ok();
});

test("Heal menu exists in Monitoring page", async (t) => {
  await t
    .expect(monitoringElement.exists)
    .ok()
    .click(monitoringElement)
    .expect(drivesElement.exists)
    .ok();
});

test("Heal page can be opened", async (t) => {
  await t.navigateTo("http://localhost:9090/tools/heal");
});

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "heal");
  })("Start button exists", async (t) => {
    const startButtonExists = elements.startButton.exists;
    await t
      .useRole(roles.heal)
      .navigateTo("http://localhost:9090/tools/heal")
      .expect(startButtonExists)
      .ok();
  })
  .after(async (t) => {
    // Cleanup created bucket
    await functions.cleanUpBucket(t, "heal");
  });

test
  .before(async (t) => {
    // Create a bucket
    await functions.setUpBucket(t, "heal2");
  })("Start button can be clicked", async (t) => {
    await t
      .useRole(roles.heal)
      .navigateTo("http://localhost:9090/tools/heal")
      .click(elements.bucketNameInput)
      .click(bucketDropdownOptionFor("heal2"))
      .click(elements.startButton);
  })
  .after(async (t) => {
    // Cleanup created bucket
    await functions.cleanUpBucket(t, "heal2");
  });
