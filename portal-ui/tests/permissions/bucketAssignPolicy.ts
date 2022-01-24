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

import * as functions from "../utils/functions";
import { bucketsElement, logoutItem } from "../utils/elements-menu";
import { Selector } from "testcafe";
import * as constants from "../utils/constants";
import { manageButtonFor } from "../utils/functions";

fixture("For user with Bucket Assign Policy permissions")
  .page("http://localhost:9090")
  .beforeEach(async (t) => {
    await t.useRole(roles.bucketAssignPolicy);
  });

// Bucket assign policy permissions
test("Buckets sidebar item exists", async (t) => {
  const bucketsExist = bucketsElement.exists;
  await t.expect(bucketsExist).ok();
});

test.before(async (t) => {
  // Create a bucket
  await functions.setUpBucket(t, "bucketassign");
})("A readonly policy can be assigned to a bucket", async (t) => {
  const manageButton = manageButtonFor("bucketassign");
  await t
    // We need to log back in after we use the admin account to create bucket,
    // using the specific role we use in this module
    .useRole(roles.bucketAssignPolicy)
    .navigateTo("http://localhost:9090/buckets")
    .click(manageButton)
    .click(elements.bucketAccessRulesTab)
    .click(elements.addAccessRuleButton)
    .typeText(elements.bucketsPrefixInput, "readonlytest")
    .click(elements.bucketsAccessInput)
    .click(elements.bucketsAccessReadOnlyInput)
    .click(elements.saveButton);
});

test("A writeonly policy can be assigned to a bucket", async (t) => {
  const manageButton = manageButtonFor("bucketassign");
  await t
    .navigateTo("http://localhost:9090/buckets")
    .click(manageButton)
    .click(elements.bucketAccessRulesTab)
    .click(elements.addAccessRuleButton)
    .typeText(elements.bucketsPrefixInput, "writeonlytest")
    .click(elements.bucketsAccessInput)
    .click(elements.bucketsAccessWriteOnlyInput)
    .click(elements.saveButton);
});

test("A readwrite policy can be assigned to a bucket", async (t) => {
  const manageButton = manageButtonFor("bucketassign");
  await t
    .navigateTo("http://localhost:9090/buckets")
    .click(manageButton)
    .click(elements.bucketAccessRulesTab)
    .click(elements.addAccessRuleButton)
    .typeText(elements.bucketsPrefixInput, "readwritetest")
    .click(elements.bucketsAccessInput)
    .click(elements.bucketsAccessReadWriteInput)
    .click(elements.saveButton);
});

test("Previously assigned policy to a bucket can be deleted", async (t) => {
  const manageButton = manageButtonFor("bucketassign");
  await t
    .navigateTo("http://localhost:9090/buckets")
    .click(manageButton)
    .click(elements.bucketAccessRulesTab)
    .click(elements.deleteIconButtonAlt)
    .click(elements.deleteButton)
    .click(logoutItem);
});
