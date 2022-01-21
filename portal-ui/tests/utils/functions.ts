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

import * as roles from "./roles";
import * as elements from "./elements";
import * as constants from "./constants";
import { Selector } from "testcafe";
import { logoutItem } from "./elements-menu";

export const setUpBucket = (t) => {
  return t
    .useRole(roles.admin)
    .navigateTo("http://localhost:9090/buckets")
    .click(elements.createBucketButton)
    .typeText(elements.bucketNameInput, constants.TEST_BUCKET_NAME)
    .click(elements.createBucketButton)
    .click(logoutItem);
};

export const cleanUpBucket = (t) => {
  return (
    t
      // useRole doesn't work here so we would need to enter the commands manually
      .navigateTo("http://localhost:9090/login")
      .typeText("#accessKey", "minioadmin")
      .typeText("#secretKey", "minioadmin")
      .click(elements.loginSubmitButton)
      .navigateTo("http://localhost:9090/buckets")
      .click(elements.manageButton)
      .click(elements.deleteBucketButton)
      .click(elements.deleteButton)
      .click(logoutItem)
  );
};

export const cleanUpBucketAndUploads = (t) => {
  return (
    t
      // useRole doesn't work here so we would need to enter the commands manually
      .navigateTo("http://localhost:9090/login")
      .typeText("#accessKey", "minioadmin")
      .typeText("#secretKey", "minioadmin")
      .click(elements.loginSubmitButton)
      .navigateTo("http://localhost:9090/buckets")
      .click(elements.testBucketBrowseButton)
      .click(elements.deleteIconButtonAlt)
      .click(elements.deleteButton)
      .click(elements.configureBucketButton)
      .click(elements.deleteBucketButton)
      .click(elements.deleteButton)
      .click(logoutItem)
  );
};

export const createUser = (t) => {
  return t
    .useRole(roles.admin)
    .navigateTo("http://localhost:9090/identity/users")
    .click(elements.createUserButton)
    .typeText(elements.usersAccessKeyInput, constants.TEST_USER_NAME)
    .typeText(elements.usersSecretKeyInput, constants.TEST_PASSWORD)
    .click(elements.saveButton);
};

export const cleanUpUser = (t) => {
  const userListItem = Selector(".ReactVirtualized__Table__rowColumn").withText(
    constants.TEST_USER_NAME
  );

  const userDeleteIconButton = userListItem
    .nextSibling()
    .child("button")
    .withAttribute("aria-label", "delete");

  return t
    .useRole(roles.admin)
    .navigateTo("http://localhost:9090/identity/users")
    .click(userDeleteIconButton)
    .click(elements.deleteButton);
};
