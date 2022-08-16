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
import { diagnosticsElement, supportElement } from "../utils/elements-menu";
import { ClientFunction } from "testcafe";

fixture("For user with Diagnostics permissions").page("http://localhost:9090");

test("Support sidebar item exists", async (t) => {
  await t.useRole(roles.diagnostics).expect(supportElement.exists).ok();
});

test("Diagnostics link exists in Tools page", async (t) => {
  await t
    .useRole(roles.diagnostics)
    .expect(supportElement.exists)
    .ok()
    .click(supportElement)
    .expect(diagnosticsElement.exists)
    .ok();
});

test("Diagnostics page can be opened", async (t) => {
  await t
    .useRole(roles.diagnostics)
    .navigateTo("http://localhost:9090/support/diagnostics");
});

test("Start Diagnostic button exists", async (t) => {
  const startDiagnosticExists = elements.startDiagnosticButton.exists;
  await t
    .useRole(roles.diagnostics)
    .navigateTo("http://localhost:9090/support/diagnostics")
    .expect(startDiagnosticExists)
    .ok();
});

test("Start Diagnostic button can be clicked", async (t) => {
  await t
    .useRole(roles.diagnostics)
    .navigateTo("http://localhost:9090/support/diagnostics")
    .click(elements.startDiagnosticButton);
});

test("Download button exists after Diagnostic is completed", async (t) => {
  // MinIO can fail in the diagnostic and this is not UI problem
  // If there is an error with diagnostic, don't proceed with UI testing
  // Only proceed if there is no error
  const matchingElement = ClientFunction(() =>
    document.evaluate(
      "//div[text()='An error occurred while getting the Diagnostic file.']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
  );
  await t
    .useRole(roles.diagnostics)
    .navigateTo("http://localhost:9090/support/diagnostics")
    .click(elements.startDiagnosticButton)
    .wait(3000);
  if ((await matchingElement()) == null) {
    // expect button only no error from minio diagnostic
    await t.expect(elements.downloadButton.exists).ok();
  }
});

test("Download button is clickable after Diagnostic is completed", async (t) => {
  // MinIO can fail in the diagnostic and this is not UI problem
  // If there is an error with diagnostic, don't proceed with UI testing
  // Only proceed if there is no error
  const matchingElement = ClientFunction(() =>
    document.evaluate(
      "//div[text()='An error occurred while getting the Diagnostic file.']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
  );
  await t
    .useRole(roles.diagnostics)
    .navigateTo("http://localhost:9090/support/diagnostics")
    .click(elements.startDiagnosticButton)
    .wait(2000);
  if ((await matchingElement()) == null) {
    // click only if no error
    await t.click(elements.downloadButton);
  }
});

test("Start New Diagnostic button exists after Diagnostic is completed", async (t) => {
  // MinIO can fail in the diagnostic and this is not UI problem
  // If there is an error with diagnostic, don't proceed with UI testing
  // Only proceed if there is no error
  const matchingElement = ClientFunction(() =>
    document.evaluate(
      "//div[text()='An error occurred while getting the Diagnostic file.']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
  );
  await t
    .useRole(roles.diagnostics)
    .navigateTo("http://localhost:9090/support/diagnostics")
    .click(elements.startDiagnosticButton)
    .wait(3000);
  if ((await matchingElement()) == null) {
    // expect button only if no error
    await t
      .expect(elements.downloadButton.exists)
      .ok()
      .expect(elements.startNewDiagnosticButton.exists)
      .ok();
  }
});

test("Start New Diagnostic button is clickable after Diagnostic is completed", async (t) => {
  // MinIO can fail in the diagnostic and this is not UI problem
  // If there is an error with diagnostic, don't proceed with UI testing
  // Only proceed if there is no error
  const matchingElement = ClientFunction(() =>
    document.evaluate(
      "//div[text()='An error occurred while getting the Diagnostic file.']",
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
  );
  await t
    .useRole(roles.diagnostics)
    .navigateTo("http://localhost:9090/support/diagnostics")
    .click(elements.startDiagnosticButton)
    .wait(3000);
  if ((await matchingElement()) == null) {
    // expect button only if no error
    await t
      .expect(elements.downloadButton.exists)
      .ok()
      .click(elements.startNewDiagnosticButton);
  }
});
