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

import * as constants from "./constants";
import { Selector } from "testcafe";

//----------------------------------------------------
// Buttons
//----------------------------------------------------
export const loginSubmitButton = Selector("form button");
export const closeAlertButton = Selector(
  'button[class*="ModalError-closeButton"]'
);

export const uploadButton = Selector("span")
  .withAttribute("aria-label", "Upload Files")
  .child("button:enabled");
export const createPolicyButton =
  Selector("button:enabled").withText("Create Policy");
export const saveButton = Selector("button:enabled").withText("Save");
export const deleteButton = Selector("button:enabled").withExactText("Delete");
export const deleteIconButton = Selector("button:enabled").withAttribute(
  "aria-label",
  "Delete"
);
export const deleteIconButtonAlt = Selector("button:enabled").withAttribute(
  "aria-label",
  "delete"
);
export const configureBucketButton = Selector(
  'span[class*="MuiIconButton-root"]'
).withAttribute("aria-label", "Configure Bucket");
export const addNotifTargetButton = Selector("button:enabled").withText(
  "Add Notification Target"
);
export const createTierButton =
  Selector("button:enabled").withText("Create Tier");
export const createBucketButton =
  Selector("button:enabled").withText("Create Bucket");
export const deleteBucketButton =
  Selector("button:enabled").withText("Delete Bucket");
export const createUserButton =
  Selector("button:enabled").withText("Create User");
export const createGroupButton =
  Selector("button:enabled").withText("Create Group");
export const deleteGroupIconButton = Selector("span")
  .withAttribute("aria-label", "Delete Group")
  .find("button:enabled");
export const editMembersButton =
  Selector("button:enabled").withText("Edit Members");
export const addAccessRuleButton =
  Selector("button:enabled").withText("Add Access Rule");
export const startDiagnosticButton =
  Selector("button:enabled").withText("Start Diagnostic");
export const startNewDiagnosticButton = Selector("#start-new-diagnostic");
export const downloadButton = Selector("button:enabled").withText("Download");
export const startButton = Selector("button:enabled").withText("Start");
export const stopButton = Selector("button:enabled").withText("Stop");

//----------------------------------------------------
// Links
//----------------------------------------------------
export const logsLink = Selector("a").withText("Logs");
export const watchLink = Selector("a").withText("Watch");
export const traceLink = Selector("a").withText("Trace");
export const healLink = Selector("a").withText("Heal");
export const diagnosticsLink = Selector("a").withText("Diagnostics");

//----------------------------------------------------
// Switches
//----------------------------------------------------
export const switchInput = Selector(".MuiSwitch-input");

//----------------------------------------------------
// Inputs
//----------------------------------------------------
export const bucketNameInput = Selector("#bucket-name");
export const bucketsPrefixInput = Selector("#prefix");
export const bucketsAccessInput = Selector(
  'input[class*="MuiSelect-nativeInput"]'
);
export const bucketsAccessReadOnlyInput = Selector(
  'li[class*="MuiMenuItem-root"]'
).withText("Readonly");
export const bucketsAccessWriteOnlyInput = Selector(
  'li[class*="MuiMenuItem-root"]'
).withText("Writeonly");
export const bucketsAccessReadWriteInput = Selector(
  'li[class*="MuiMenuItem-root"]'
).withText("Readwrite");
export const uploadInput = Selector("input").withAttribute("type", "file");
export const createPolicyName = Selector("#policy-name");
export const createPolicyTextfield = Selector(".cm-content");
export const usersAccessKeyInput = Selector("#accesskey-input");
export const usersSecretKeyInput = Selector("#standard-multiline-static");
export const groupNameInput = Selector("#group-name");
export const searchResourceInput = Selector("#search-resource");
export const filterUserInput = searchResourceInput.withAttribute(
  "placeholder",
  "Filter Users"
);
export const groupUserCheckbox = Selector(".ReactVirtualized__Table__row span")
  .withText(constants.TEST_USER_NAME)
  .parent(1)
  .find(".ReactVirtualized__Grid input")
  .withAttribute("type", "checkbox");

//----------------------------------------------------
// Dropdowns and options
//----------------------------------------------------
export const bucketDropdownOptionFor = (modifier) => {
  return Selector("li").withAttribute(
    "data-value",
    `${constants.TEST_BUCKET_NAME}-${modifier}`
  );
};

//----------------------------------------------------
// Text
//----------------------------------------------------
export const groupStatusText = Selector("#group-status");

//----------------------------------------------------
// Tables, table headers and content
//----------------------------------------------------
export const table = Selector(".ReactVirtualized__Table");
export const bucketsTableDisabled = Selector("#object-list-wrapper")
  .find(".MuiPaper-root")
  .withText("This location is empty, please try uploading a new file");
export const createGroupUserTable = Selector(
  ".MuiDialog-container .ReactVirtualized__Table"
);

//----------------------------------------------------
// Bucket page vertical tabs
//----------------------------------------------------
export const bucketAccessRulesTab =
  Selector(".MuiTab-root").withText("Access Rules");

//----------------------------------------------------
// Settings window
//----------------------------------------------------
export const settingsWindow = Selector("#settings-container");

//----------------------------------------------------
// Settings page vertical tabs
//----------------------------------------------------
export const settingsRegionTab = Selector(".MuiTab-root").withAttribute(
  "href",
  "/settings/configurations/region"
);
export const settingsCacheTab = Selector(".MuiTab-root").withAttribute(
  "href",
  "/settings/configurations/cache"
);
export const settingsCompressionTab = Selector(".MuiTab-root").withAttribute(
  "href",
  "/settings/configurations/compression"
);
export const settingsApiTab = Selector(".MuiTab-root").withAttribute(
  "href",
  "/settings/configurations/api"
);
export const settingsHealTab = Selector(".MuiTab-root").withAttribute(
  "href",
  "/settings/configurations/heal"
);
export const settingsScannerTab = Selector(".MuiTab-root").withAttribute(
  "href",
  "/settings/configurations/scanner"
);
export const settingsEtcdTab = Selector(".MuiTab-root").withAttribute(
  "href",
  "/settings/configurations/etcd"
);
export const settingsOpenIdTab = Selector(".MuiTab-root").withAttribute(
  "href",
  "/settings/configurations/identity_openid"
);
export const settingsLdapTab = Selector(".MuiTab-root").withAttribute(
  "href",
  "/settings/configurations/identity_ldap"
);
export const settingsLoggerWebhookTab = Selector(".MuiTab-root").withAttribute(
  "href",
  "/settings/configurations/logger_webhook"
);
export const settingsAuditWebhookTab = Selector(".MuiTab-root").withAttribute(
  "href",
  "/settings/configurations/audit_webhook"
);

//----------------------------------------------------
// Log window
//----------------------------------------------------
export const logWindow = Selector("#logs-container");
