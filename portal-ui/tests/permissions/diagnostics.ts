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

fixture("For user with Diagnostics permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.diagnostics);
  });

test("Tools sidebar item exists", async (t) => {
  const toolsExist = elements.toolsElement.exists;
  await t.expect(toolsExist).ok();
});

test("Diagnostics link exists in Tools page", async (t) => {
  const diagnosticsLinkExists = elements.diagnosticsLink.exists;
  await t.click(elements.toolsElement).expect(diagnosticsLinkExists).ok();
});

test("Diagnostics page can be opened", async (t) => {
  await t.navigateTo("http://localhost:9090/tools/diagnostics");
});

test("Start Diagnostic button exists", async (t) => {
  const startDiagnosticExists = elements.startDiagnosticButton.exists;
  await t
    .navigateTo("http://localhost:9090/tools/diagnostics")
    .expect(startDiagnosticExists)
    .ok();
});

test("Start Diagnostic button can be clicked", async (t) => {
  await t
    .navigateTo("http://localhost:9090/tools/diagnostics")
    .click(elements.startDiagnosticButton);
});

// TODO: Fix test failing sporadically on GitHub Actions

// test("Download button exists after Diagnostic is completed", async (t) => {
//   const downloadExists = elements.downloadButton.exists;
//   await t
//     .navigateTo("http://localhost:9090/tools/diagnostics")
//     .click(elements.startDiagnosticButton)
//     .expect(downloadExists).ok();
// });

// test("Download button is clickable after Diagnostic is completed", async (t) => {
//   await t
//     .navigateTo("http://localhost:9090/tools/diagnostics")
//     .click(elements.startDiagnosticButton)
//     .click(elements.downloadButton);
// });

test("Start New Diagnostic button exists after Diagnostic is completed", async (t) => {
  const startNewDiagnosticButtonExists =
    elements.startNewDiagnosticButton.exists;
  await t
    .navigateTo("http://localhost:9090/tools/diagnostics")
    .click(elements.startDiagnosticButton)
    .expect(startNewDiagnosticButtonExists)
    .ok();
});

test("Start New Diagnostic button is clickable after Diagnostic is completed", async (t) => {
  await t
    .navigateTo("http://localhost:9090/tools/diagnostics")
    .click(elements.startDiagnosticButton)
    .click(elements.startNewDiagnosticButton);
});
