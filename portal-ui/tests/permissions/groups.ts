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

const groupsListItem = Selector(".ReactVirtualized__Table__rowColumn").withText(
  constants.TEST_GROUP_NAME
);

fixture("For user with Groups permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.groups);
  });

test("Groups sidebar item exists", async (t) => {
  await t
    .expect(identityElement.exists)
    .ok()
    .click(identityElement)
    .expect(groupsElement.exists)
    .ok();
});

test("Create Group button exists", async (t) => {
  const createGroupButtonExists = elements.createGroupButton.exists;
  await t
    .navigateTo("http://localhost:9090/identity/groups")
    .expect(createGroupButtonExists)
    .ok();
});

test("Create Group button is clickable", async (t) => {
  await t
    .navigateTo("http://localhost:9090/identity/groups")
    .click(elements.createGroupButton);
});

test("Group Name input exists in the Create Group modal", async (t) => {
  const groupNameInputExists = elements.groupNameInput.exists;
  await t
    .navigateTo("http://localhost:9090/identity/groups")
    .click(elements.createGroupButton)
    .expect(groupNameInputExists)
    .ok();
});

test("Users table exists in the Create Group modal", async (t) => {
  const createGroupUserTableExists = elements.table.exists;
  await t
    .navigateTo("http://localhost:9090/identity/groups")
    .click(elements.createGroupButton)
    .expect(createGroupUserTableExists)
    .ok();
});

test.before(async (t) => {
  // A user must be created as we need to choose a user from the dropdown
  await functions.createUser(t);
})(
  "Create Group modal can be submitted after inputs are entered",
  async (t) => {
    // We need to log back in after we use the admin account to create bucket,
    // using the specific role we use in this module
    await t
      .useRole(roles.groups)
      .navigateTo("http://localhost:9090/identity/groups")
      .click(elements.createGroupButton)
      .typeText(elements.groupNameInput, constants.TEST_GROUP_NAME)
      .typeText(elements.filterUserInput, constants.TEST_USER_NAME)
      .click(elements.groupUserCheckbox)
      .click(elements.saveButton);
  }
);

test("Groups table exists", async (t) => {
  const groupsTableExists = elements.table.exists;
  await t
    .navigateTo("http://localhost:9090/identity/groups")
    .expect(groupsTableExists)
    .ok();
});

test("Created Group can be disabled and enabled back", async (t) => {
  await t
    .navigateTo("http://localhost:9090/identity/groups")
    .click(groupsListItem)
    .click(elements.switchInput)
    .expect(elements.groupStatusText.innerText)
    .eql("Disabled")
    .click(elements.switchInput)
    .expect(elements.groupStatusText.innerText)
    .eql("Enabled");
});

test("Created Group can be viewed and deleted", async (t) => {
  await t
    .navigateTo("http://localhost:9090/identity/groups")
    .click(groupsListItem)
    .click(elements.editMembersButton)
    .typeText(elements.filterUserInput, constants.TEST_USER_NAME)
    .click(elements.groupUserCheckbox)
    .click(elements.saveButton)
    .click(elements.deleteGroupIconButton)
    .click(elements.deleteButton);
});
