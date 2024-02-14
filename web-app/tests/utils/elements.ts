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
export const uploadButton = Selector("button:enabled").withAttribute(
  "id",
  "upload-main",
);
export const createPolicyButton =
  Selector("button:enabled").withText("Create Policy");
export const saveButton = Selector("button:enabled").withText("Save");
export const deleteButton = Selector("button:enabled").withExactText("Delete");

export const addEventDestination = Selector("button:enabled").withText(
  "Add Event Destination",
);
export const createTierButton =
  Selector("button:enabled").withText("Create Tier");
export const createUserButton =
  Selector("button:enabled").withText("Create User");
export const createGroupButton =
  Selector("button:enabled").withText("Create Group");
export const addAccessRuleButton =
  Selector("button:enabled").withText("Add Access Rule");
export const startDiagnosticButton = Selector("button:disabled").withText(
  "Start Health Report",
);
export const startNewDiagnosticButton = Selector("#start-new-diagnostic");
export const downloadButton = Selector("button:enabled").withText("Download");
export const startButton = Selector("button:enabled").withText("Start");
export const assignPoliciesButton = Selector("button").withAttribute(
  "id",
  "assign-policies",
);

//----------------------------------------------------
// Switches
//----------------------------------------------------
export const switchInput = Selector("#group-status").sibling("span");
export const deleteAllVersions =
  Selector("#delete-versions").sibling("span.switchRail");

//----------------------------------------------------
// Inputs
//----------------------------------------------------
export const bucketNameInput = Selector("#bucket-name-select");
export const bucketsPrefixInput = Selector("#prefix");
export const bucketsAccessInput = Selector("div.selectContainer");
export const bucketsAccessReadOnlyInput = Selector("div").withAttribute(
  "label",
  "readonly",
);
export const bucketsAccessWriteOnlyInput = Selector("div").withAttribute(
  "label",
  "writeonly",
);
export const bucketsAccessReadWriteInput = Selector("div").withAttribute(
  "label",
  "readwrite",
);
export const uploadInput = Selector("input").withAttribute("type", "file");
export const createPolicyName = Selector("#policy-name");
export const createPolicyTextfield = Selector(".w-tc-editor-text");
export const usersAccessKeyInput = Selector("#accesskey-input");
export const usersSecretKeyInput = Selector("#standard-multiline-static");
export const groupNameInput = Selector("#group-name");
export const searchResourceInput = Selector("#search-resource");
export const filterUserInput = searchResourceInput.withAttribute(
  "placeholder",
  "Filter Users",
);
export const groupUserCheckbox = Selector(".ReactVirtualized__Table__row input")
  .withAttribute("type", "checkbox")
  .withAttribute("value", constants.TEST_USER_NAME)
  .sibling("span");

//----------------------------------------------------
// Dropdowns and options
//----------------------------------------------------
export const bucketDropdownOptionFor = (modifier) => {
  return Selector("#bucket-name-options-selector div").withText(
    `${constants.TEST_BUCKET_NAME}-${modifier}`,
  );
};

//----------------------------------------------------
// Text
//----------------------------------------------------
export const groupStatusText = Selector("#group-status-label");

//----------------------------------------------------
// Tables, table headers and content
//----------------------------------------------------
export const table = Selector(".ReactVirtualized__Table");
export const bucketsTableDisabled = Selector("#empty-results").withText(
  "You require additional permissions in order to view Objects in this bucket. Please ask your MinIO administrator to grant you",
);
export const createGroupUserTable = Selector(
  ".MuiDialog-container .ReactVirtualized__Table",
);

//----------------------------------------------------
// Bucket page vertical tabs
//----------------------------------------------------
export const bucketAccessRulesTab = Selector("button").withAttribute(
  "id",
  "anonymous",
);

//----------------------------------------------------
// Settings window
//----------------------------------------------------
export const settingsWindow = Selector("#settings-container");

//----------------------------------------------------
// Settings page vertical tabs
//----------------------------------------------------
export const settingsRegionTab = Selector("button").withAttribute(
  "id",
  "settings-tab-Region",
);
export const settingsCompressionTab = Selector("button").withAttribute(
  "id",
  "settings-tab-Compression",
);
export const settingsApiTab = Selector("button").withAttribute(
  "id",
  "settings-tab-API",
);
export const settingsHealTab = Selector("button").withAttribute(
  "id",
  "settings-tab-Heal",
);
export const settingsScannerTab = Selector("button").withAttribute(
  "id",
  "settings-tab-Scanner",
);
export const settingsEtcdTab = Selector("button").withAttribute(
  "id",
  "settings-tab-Etcd",
);
export const settingsLoggerWebhookTab = Selector("button").withAttribute(
  "id",
  "settings-tab-Logger Webhook",
);
export const settingsAuditWebhookTab = Selector("button").withAttribute(
  "id",
  "settings-tab-Audit Webhook",
);
export const settingsAuditKafkaTab = Selector("button").withAttribute(
  "id",
  "settings-tab-Audit Kafka",
);

//----------------------------------------------------
// Log window
//----------------------------------------------------
export const logWindow = Selector('[data-test-id="logs-list-container"]');
//Node selector
export const nodeSelector = Selector("#node-selector-select");
//----------------------------------------------------
// User Details
//----------------------------------------------------
export const userPolicies = Selector(".optionsList button").withAttribute(
  "id",
  "policies",
);
//----------------------------------------------------
// Rewind Options
//----------------------------------------------------
export const rewindButton = Selector("button").withAttribute(
  "id",
  "rewind-objects-list",
);
export const rewindToBaseInput = Selector("div").withAttribute(
  "id",
  "rewind-selector-DateTimeInput",
);
export const rewindToInput = Selector("input").withAttribute(
  "id",
  "rewind-selector",
);
export const rewindDataButton = Selector("button").withAttribute(
  "id",
  "rewind-apply-button",
);
export const locationEmpty = Selector("div").withAttribute(
  "id",
  "empty-results",
);
//----------------------------------------------------
// Login Window
//----------------------------------------------------
export const loginButton = Selector("button").withAttribute("id", "do-login");
