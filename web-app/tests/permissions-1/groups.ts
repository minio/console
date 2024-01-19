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
import * as constants from "../utils/constants";
import * as functions from "../utils/functions";
import { Selector } from "testcafe";
import { groupsElement, identityElement } from "../utils/elements-menu";
import { IAM_PAGES } from "../../src/common/SecureComponent/permissions";

const groupsListItemFor = (modifier: string) => {
  return Selector(".ReactVirtualized__Table__rowColumn").withText(
    `${constants.TEST_GROUP_NAME}-${modifier}`,
  );
};

const appBaseUrl = "http://localhost:9090";
let groupsPageUrl = `${appBaseUrl}${IAM_PAGES.GROUPS}`;
let groupsAddPageUrl = `${appBaseUrl}${IAM_PAGES.GROUPS_ADD}`;
const createGroup = async (t: TestController, modifier: string) => {
  await t
    .useRole(roles.groups)
    .navigateTo(groupsAddPageUrl)
    .typeText(
      elements.groupNameInput,
      `${constants.TEST_GROUP_NAME}-${modifier}`,
    )
    .typeText(elements.filterUserInput, constants.TEST_USER_NAME)
    .click(elements.groupUserCheckbox)
    .click(elements.saveButton);
};

fixture("For user with Groups permissions")
  .page(appBaseUrl)
  .beforeEach(async (t) => {
    await t.useRole(roles.groups);
  });

test("Create Group button exists", async (t) => {
  const createGroupButtonExists = elements.createGroupButton.exists;
  await t
    .navigateTo(groupsPageUrl)
    .expect(createGroupButtonExists)
    .ok()
    .wait(2000);
});

test("Groups sidebar item exists", async (t) => {
  await t
    .expect(identityElement.exists)
    .ok()
    .click(identityElement)
    .expect(groupsElement.exists)
    .ok()
    .wait(2000);
});

test("Create Group button is clickable", async (t) => {
  await t
    .navigateTo(groupsPageUrl)
    .click(elements.createGroupButton)
    .expect(true)
    .ok()
    .wait(2000);
});

test("Group Name input exists in the Create Group page", async (t) => {
  await t
    .navigateTo(groupsPageUrl)
    .click(elements.createGroupButton)
    .expect(elements.groupNameInput.exists)
    .ok()
    .wait(2000);
});

test("Users table exists in the Create Groups page", async (t) => {
  const createGroupUserTableExists = elements.table.exists;
  await t
    .navigateTo(groupsPageUrl)
    .click(elements.createGroupButton)
    .expect(createGroupUserTableExists)
    .ok()
    .wait(2000);
});

test.before(async (t) => {
  // A user must be created as we need to choose a user from the dropdown
  await functions.createUser(t);
})("Create Group page can be submitted after inputs are entered", async (t) => {
  // We need to log back in after we use the admin account to create bucket,
  // using the specific role we use in this module
  await t
    .useRole(roles.groups)
    .navigateTo(groupsAddPageUrl)
    .typeText(elements.groupNameInput, constants.TEST_GROUP_NAME)
    .typeText(elements.filterUserInput, constants.TEST_USER_NAME)
    .click(elements.groupUserCheckbox)
    .click(elements.saveButton)
    .wait(2000);
});

test.before(async (t) => {
  // A user must be created as we need to choose a user from the dropdown
  await functions.createUser(t);
  await createGroup(t, "groups-table");
})("Groups table exists", async (t) => {
  await t
    .navigateTo(groupsPageUrl)
    .expect(elements.table.exists)
    .ok()
    .wait(2000);
});

test.before(async (t) => {
  // A user must be created as we need to choose a user from the dropdown
  await functions.createUser(t);
  await createGroup(t, "disable-enable");
})("Created Group can be disabled and enabled back", async (t) => {
  await t
    .navigateTo(groupsPageUrl)
    .click(groupsListItemFor("disable-enable"))
    .click(elements.switchInput)
    .expect(elements.groupStatusText.innerText)
    .eql("Disabled")
    .click(elements.switchInput)
    .expect(elements.groupStatusText.innerText)
    .eql("Enabled");
});
