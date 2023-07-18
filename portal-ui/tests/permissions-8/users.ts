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
import { Selector } from "testcafe";
import { identityElement, usersElement } from "../utils/elements-menu";
import { IAM_PAGES } from "../../src/common/SecureComponent/permissions";

const userListItem = Selector(".ReactVirtualized__Table__rowColumn").withText(
  constants.TEST_USER_NAME,
);
const policyListItem = Selector(".ReactVirtualized__Table__rowColumn").withText(
  constants.TEST_ASSIGN_POLICY_NAME,
);

const userDeleteIconButton = userListItem
  .child("checkbox")
  .withAttribute("aria-label", "secondary checkbox");

const userCheckbox = Selector(".TableCheckbox span.checkbox");

fixture("For user with Users permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.users);
  });

test("Users sidebar item exists", async (t) => {
  const usersExist = usersElement.exists;
  await t
    .expect(identityElement.exists)
    .ok()
    .click(identityElement)
    .expect(usersExist)
    .ok();
});
const appBaseUrl = "http://localhost:9090";
let usersPageUrl = `${appBaseUrl}${IAM_PAGES.USERS}`;
let usersAddPageUrl = `${appBaseUrl}${IAM_PAGES.USER_ADD}`;
test("Create User button exists", async (t) => {
  const createUserButtonExists = elements.createUserButton.exists;
  await t.navigateTo(usersPageUrl).expect(createUserButtonExists).ok();
});

test("Create User button is clickable", async (t) => {
  await t.navigateTo(usersPageUrl).click(elements.createUserButton);
});

test("Create User Page to create a user", async (t) => {
  const accessKeyInputExists = elements.usersAccessKeyInput.exists;
  const secretKeyInputExists = elements.usersSecretKeyInput.exists;
  await t
    .navigateTo(usersAddPageUrl)
    .expect(accessKeyInputExists)
    .ok()
    .expect(secretKeyInputExists)
    .ok()
    .typeText(elements.usersAccessKeyInput, constants.TEST_USER_NAME)
    .typeText(elements.usersSecretKeyInput, constants.TEST_PASSWORD)
    .click(elements.saveButton);
});

test("Users table exists", async (t) => {
  const usersTableExists = elements.table.exists;
  await t.navigateTo(usersPageUrl).expect(usersTableExists).ok();
});

test("IAM Policy can be set on User", async (t) => {
  const userListItemExists = userListItem.exists;
  const policyListItemExists = policyListItem.exists;
  await t
    .navigateTo(usersPageUrl)
    .typeText(elements.searchResourceInput, constants.TEST_USER_NAME)
    .expect(userListItemExists)
    .ok()
    .click(userListItem)
    .click(elements.userPolicies)
    .click(elements.assignPoliciesButton)
    .typeText(elements.searchResourceInput, constants.TEST_ASSIGN_POLICY_NAME)
    .click(userCheckbox)
    .click(elements.saveButton)
    .expect(policyListItemExists)
    .ok();
});

test("Created User can be viewed and deleted", async (t) => {
  const userListItemExists = userListItem.exists;
  const deleteSelectedButton = Selector("button").withAttribute(
    "id",
    "delete-selected-users",
  );
  await t
    .navigateTo(usersPageUrl)
    .typeText(elements.searchResourceInput, constants.TEST_USER_NAME)
    .expect(userListItemExists)
    .ok()
    .click(userCheckbox)
    .click(deleteSelectedButton)
    .click(elements.deleteButton)
    .expect(userListItemExists)
    .notOk();
});
