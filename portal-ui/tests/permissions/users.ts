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

const userListItem = Selector(".ReactVirtualized__Table__rowColumn").withText(
  constants.TEST_USER_NAME
);

const userDeleteIconButton = userListItem
  .nextSibling()
  .child("button")
  .withAttribute("aria-label", "delete");

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

test("Create User button exists", async (t) => {
  const createUserButtonExists = elements.createUserButton.exists;
  await t
    .navigateTo("http://localhost:9090/identity/users")
    .expect(createUserButtonExists)
    .ok();
});

test("Create User button is clickable", async (t) => {
  await t
    .navigateTo("http://localhost:9090/identity/users")
    .click(elements.createUserButton);
});

test("Access Key input exists in the Create User modal", async (t) => {
  const accessKeyInputExists = elements.usersAccessKeyInput.exists;
  await t
    .navigateTo("http://localhost:9090/identity/users")
    .click(elements.createUserButton)
    .expect(accessKeyInputExists)
    .ok();
});

test("Secret Key input exists in the Create User modal", async (t) => {
  const secretKeyInputExists = elements.usersSecretKeyInput.exists;
  await t
    .navigateTo("http://localhost:9090/identity/users")
    .click(elements.createUserButton)
    .expect(secretKeyInputExists)
    .ok();
});

test("Create User modal can be submitted after inputs are entered", async (t) => {
  await t
    .navigateTo("http://localhost:9090/identity/users")
    .click(elements.createUserButton)
    .typeText(elements.usersAccessKeyInput, constants.TEST_USER_NAME)
    .typeText(elements.usersSecretKeyInput, constants.TEST_PASSWORD)
    .click(elements.saveButton);
});

test("Users table exists", async (t) => {
  const usersTableExists = elements.table.exists;
  await t
    .navigateTo("http://localhost:9090/identity/users")
    .expect(usersTableExists)
    .ok();
});

test("Created User can be viewed and deleted", async (t) => {
  const userListItemExists = userListItem.exists;
  await t
    .navigateTo("http://localhost:9090/identity/users")
    .typeText(elements.searchResourceInput, constants.TEST_USER_NAME)
    .expect(userListItemExists)
    .ok()
    .click(userDeleteIconButton)
    .click(elements.deleteButton)
    .expect(userListItemExists)
    .notOk();
});
