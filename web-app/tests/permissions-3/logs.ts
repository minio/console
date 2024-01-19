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
import { logsElement, monitoringElement } from "../utils/elements-menu";

fixture("For user with Logs permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.logs);
  });

test("Tools sidebar item exists", async (t) => {
  await t.expect(monitoringElement.exists).ok();
});

test("Logs link exists in Tools page", async (t) => {
  await t
    .expect(monitoringElement.exists)
    .ok()
    .click(monitoringElement)
    .expect(logsElement.exists)
    .ok();
});

test("Logs page can be opened", async (t) => {
  await t.navigateTo("http://localhost:9090/tools/logs");
});

test("Log window exists in Logs page", async (t) => {
  const logWindowExists = elements.logWindow.exists;
  await t
    .navigateTo("http://localhost:9090/tools/logs")
    .expect(logWindowExists)
    .ok();
});

test("Node selector exists in Logs page", async (t) => {
  const nodeSelectorExists = elements.nodeSelector.exists;
  await t
    .navigateTo("http://localhost:9090/tools/logs")
    .expect(nodeSelectorExists)
    .ok();
});
