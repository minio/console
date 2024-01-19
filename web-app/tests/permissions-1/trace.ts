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
import { monitoringElement, traceElement } from "../utils/elements-menu";
import { Selector } from "testcafe";

export const traceStartButton = Selector('[data-test-id="trace-start-button"]');
export const traceStopButton = Selector('[data-test-id="trace-stop-button"]');

fixture("For user with Trace permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.trace);
  });

test("Monitoring sidebar item exists", async (t) => {
  await t.expect(monitoringElement.exists).ok();
});

test("Trace link exists in Monitoring menu", async (t) => {
  await t
    .expect(monitoringElement.exists)
    .ok()
    .click(monitoringElement)
    .expect(traceElement.exists)
    .ok();
});

test("Trace page can be opened", async (t) => {
  await t.navigateTo("http://localhost:9090/tools/trace");
});

test("Start button can be clicked", async (t) => {
  await t
    .navigateTo("http://localhost:9090/tools/trace")
    .click(traceStartButton);
});

test("Stop button appears after Start button has been clicked", async (t) => {
  const stopButtonExists = traceStopButton.exists;
  await t
    .navigateTo("http://localhost:9090/tools/trace")
    .click(traceStartButton)
    .expect(stopButtonExists)
    .ok();
});

test("Stop button can be clicked after Start button has been clicked", async (t) => {
  await t
    .navigateTo("http://localhost:9090/tools/trace")
    .click(traceStartButton)
    .click(traceStopButton);
});
