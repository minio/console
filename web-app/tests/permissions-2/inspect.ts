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

import { Role, Selector } from "testcafe";
import { readFileSync } from "fs";
import { IAM_PAGES } from "../../src/common/SecureComponent/permissions";
import { inspectElement, monitoringElement } from "../utils/elements-menu";

const data = readFileSync(__dirname + "/../constants/timestamp.txt", "utf-8");
const $TIMESTAMP = data.trim();

let testDomainUrl = "http://localhost:9090";

let insAllowedAccKey = `inspect-allowed-${$TIMESTAMP}`;
let insAllowedSeckey = "insallowed1234";
let insNotAllowedAccKey = `inspect-not-allowed-${$TIMESTAMP}`;
let insNotAllowedSeckey = "insnotallowed1234";

/* Begin Local Testing config block */

// For local Testing Create users and assign policies then update here.
// Command to invoke the test locally: testcafe chrome tests/permissions/inspect.ts
/*
testDomainUrl = "http://localhost:5005";
insAllowedAccKey = `all-actions`;
insAllowedSeckey = "minio123";
insNotAllowedAccKey = `deny-admin`;
insNotAllowedSeckey = "minio123";
*/

/* End Local Testing config block */

const loginUrl = `${testDomainUrl}/login`;
const inspectScreenUrl = `${testDomainUrl}${IAM_PAGES.SUPPORT_INSPECT}`;

const loginSubmitBtn = Selector("button").withAttribute("id", "do-login");

export const inspectEl = Selector(".MuiPaper-root")
  .find("ul")
  .child("#inspect");

export const inspect_volume_input = Selector("#inspect_volume");
export const inspect_path_input = Selector("#inspect_path");

export const inspect_volume_input_err =
  Selector("#inspect_volume").sibling("div.errorText");
export const inspect_path_input_err =
  Selector("#inspect_path").sibling("div.errorText");

export const inspect_encrypt_input = Selector("#inspect_encrypt");
export const inspect_form_clear_btn = Selector(
  '[data-test-id="inspect-clear-button"]',
);
export const inspect_form_submit_btn = Selector(
  '[data-test-id="inspect-submit-button"]',
);
/**  Begin Allowed Policy Test **/

export const inspectAllowedRole = Role(
  loginUrl,
  async (t) => {
    await t
      .typeText("#accessKey", insAllowedAccKey)
      .typeText("#secretKey", insAllowedSeckey)
      .click(loginSubmitBtn);
  },
  { preserveUrl: true },
);

fixture("For user with Inspect permissions")
  .page(testDomainUrl)
  .beforeEach(async (t) => {
    await t.useRole(inspectAllowedRole);
  });

test("Inspect page can be opened", async (t) => {
  await t.navigateTo(inspectScreenUrl);
});

test("Inspect link exists in Menu list", async (t) => {
  await t.useRole(inspectAllowedRole).expect(inspectElement.exists).ok();
});

test("Form Input states verification", async (t) => {
  const volumeValue = "test";
  const pathValue = "test.txt/xl.meta";

  await t.navigateTo(inspectScreenUrl);

  //Initial state verification
  await t.expect(inspect_volume_input.value).eql("");
  await t.expect(inspect_path_input.value).eql("");
  await t.expect(inspect_form_submit_btn.hasAttribute("disabled")).ok();
  await t.expect(inspect_encrypt_input.hasAttribute("checked")).ok();
  await t
    .expect(inspect_volume_input_err.innerText)
    .eql("This field is required");
  await t
    .expect(inspect_path_input_err.innerText)
    .eql("This field is required");
});
/**  End Allowed Policy Test **/

/**  Begin Not Allowed Policy Test **/

export const inspectNotAllowedRole = Role(
  loginUrl,
  async (t) => {
    await t
      .typeText("#accessKey", insNotAllowedAccKey)
      .typeText("#secretKey", insNotAllowedSeckey)
      .click(loginSubmitBtn);
  },
  { preserveUrl: true },
);

fixture("For user with Denied Inspect permissions")
  .page(testDomainUrl)
  .beforeEach(async (t) => {
    await t.useRole(inspectNotAllowedRole);
  });

test("Inspect page can NOT be opened", async (t) => {
  try {
    await t.navigateTo(inspectScreenUrl);
  } catch (e) {
    await t.expect(e).ok();
  }
});

test("Inspect link should NOT exists in Menu list", async (t) => {
  await t
    .expect(monitoringElement.exists)
    .ok()
    .click(monitoringElement)
    .expect(inspectEl.exists)
    .notOk(
      "Inspect Link should not exist in the menu list as per inspect not allowed policy",
    );
});
/**  End Not Allowed Policy Test **/
