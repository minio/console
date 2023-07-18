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
import {
  iamPoliciesElement,
  identityElement,
  usersElement,
} from "../utils/elements-menu";
import { IAM_PAGES } from "../../src/common/SecureComponent/permissions";

const iamPolicyListItem = Selector(
  ".ReactVirtualized__Table__rowColumn",
).withText(constants.TEST_IAM_POLICY_NAME);

const iamPolicyDelete = iamPolicyListItem
  .nextSibling()
  .child("button")
  .withAttribute("aria-label", "delete");

fixture("For user with IAM Policies permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.iamPolicies);
  });

test("IAM Policies sidebar item exists", async (t) => {
  const iamPoliciesExist = iamPoliciesElement.exists;
  await t
    .expect(identityElement.exists)
    .ok()
    .click(identityElement)
    .expect(iamPoliciesExist)
    .ok();
});

test("Create Policy button exists", async (t) => {
  const createPolicyButtonExists = elements.createPolicyButton.exists;
  await t
    .navigateTo(`http://localhost:9090${IAM_PAGES.POLICIES}`)
    .expect(createPolicyButtonExists)
    .ok();
});

test("Create Policy button is clickable", async (t) => {
  await t
    .navigateTo(`http://localhost:9090${IAM_PAGES.POLICIES}`)
    .click(elements.createPolicyButton);
});

test("Policy Name input exists in the Create Policy modal", async (t) => {
  const policyNameInputExists = elements.createPolicyName.exists;
  await t
    .navigateTo(`http://localhost:9090${IAM_PAGES.POLICIES}`)
    .click(elements.createPolicyButton)
    .expect(policyNameInputExists)
    .ok();
});

test("Policy textfield exists in the Create Policy modal", async (t) => {
  const policyTextfieldExists = elements.createPolicyTextfield.exists;
  await t
    .navigateTo(`http://localhost:9090${IAM_PAGES.POLICIES}`)
    .click(elements.createPolicyButton)
    .expect(policyTextfieldExists)
    .ok();
});

test("Create Policy modal can be submitted after inputs are entered", async (t) => {
  await t
    .navigateTo(`http://localhost:9090${IAM_PAGES.POLICIES}`)
    .click(elements.createPolicyButton)
    .typeText(elements.createPolicyName, constants.TEST_IAM_POLICY_NAME)
    .typeText(elements.createPolicyTextfield, constants.TEST_IAM_POLICY, {
      paste: true,
      replace: true,
    })
    .click(elements.saveButton);
}).after(async (t) => {
  // Clean up created policy
  await t
    .navigateTo(`http://localhost:9090${IAM_PAGES.POLICIES}`)
    .typeText(elements.searchResourceInput, constants.TEST_IAM_POLICY_NAME)
    .click(iamPolicyDelete)
    .click(elements.deleteButton);
});

test("Created Policy can be viewed and deleted", async (t) => {
  const iamPolicyListItemExists = iamPolicyListItem.exists;
  await t
    .navigateTo(`http://localhost:9090${IAM_PAGES.POLICIES}`)
    .click(elements.createPolicyButton)
    .typeText(elements.createPolicyName, constants.TEST_IAM_POLICY_NAME)
    .typeText(elements.createPolicyTextfield, constants.TEST_IAM_POLICY, {
      paste: true,
      replace: true,
    })
    .click(elements.saveButton)
    .typeText(elements.searchResourceInput, constants.TEST_IAM_POLICY_NAME)
    .expect(iamPolicyListItemExists)
    .ok()
    .click(iamPolicyDelete)
    .click(elements.deleteButton)
    .expect(iamPolicyListItemExists)
    .notOk();
});
