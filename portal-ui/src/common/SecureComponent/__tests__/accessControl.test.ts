//  This file is part of MinIO Console Server
//  Copyright (c) 2022 MinIO, Inc.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU Affero General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU Affero General Public License for more details.
//
//  You should have received a copy of the GNU Affero General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

import hasPermission from "../accessControl";
import { store } from "../../../store";
import { SESSION_RESPONSE } from "../../../screens/Console/actions";

const setPolicy1 = () => {
  store.dispatch({
    type: SESSION_RESPONSE,
    message: {
      distributedMode: true,
      features: ["log-search"],
      permissions: {
        "arn:aws:s3:::testcafe": [
          "admin:CreateUser",
          "s3:GetBucketLocation",
          "s3:ListBucket",
          "admin:CreateServiceAccount",
        ],
        "arn:aws:s3:::testcafe/*": [
          "admin:CreateServiceAccount",
          "admin:CreateUser",
          "s3:GetObject",
          "s3:ListBucket",
        ],
        "arn:aws:s3:::testcafe/write/*": [
          "admin:CreateServiceAccount",
          "admin:CreateUser",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:ListBucket",
        ],
        "console-ui": ["admin:CreateServiceAccount", "admin:CreateUser"],
      },
      operator: false,
      status: "ok",
    },
  });
};

test("Upload button disabled", () => {
  setPolicy1();
  expect(hasPermission("testcafe", ["s3:PutObject"])).toBe(false);
});

test("Upload button enabled valid prefix", () => {
  setPolicy1();
  expect(hasPermission("testcafe/write", ["s3:PutObject"], false, true)).toBe(
    true
  );
});
