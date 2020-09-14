// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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

import {policySort, usersSort, stringSort} from './sortFunctions';

it('usersSort function', () => {
  const testCases = [
    {
      args: {
        users: [
          {
            accessKey: "user",
          },
          {
            accessKey: "admin",
          },
          {
            accessKey: "operator",
          },
          {
            accessKey: "superadmin",
          },
          {
            accessKey: "partner",
          },
        ]
      },
      expectedResult:  [{"accessKey": "admin"}, {"accessKey": "operator"}, {"accessKey": "partner"}, {"accessKey": "superadmin"}, {"accessKey": "user"}],
    },
    {
      args: {
        users: [
          {
            accessKey: "user",
          },
          {
            accessKey: "admin",
          },
          {
            accessKey: "operator",
          },
          {
            accessKey: "",
          },
        ]
      },
      expectedResult:  [{"accessKey": ""}, {"accessKey": "admin"}, {"accessKey": "operator"}, {"accessKey": "user"}],
    },
    {
      args: {
        users: [
          {
            accessKey: "user",
          },
          {
            accessKey: "admin",
          },
          {
            accessKey: "operator",
          },
          {
            accessKey: null,
          },
        ]
      },
      expectedResult:  [{"accessKey": "admin"}, {"accessKey": "operator"}, {"accessKey": "user"}, {"accessKey": null}],
    }
  ];
  testCases.forEach((test) => {
    const users = test.args.users;
    const result = test.expectedResult;
    expect(users.sort(usersSort)).toEqual(result);
  })
});

it('policySort function', () => {
  const testCases = [
    {
      args: {
        policies: [
          {
            name: "user",
          },
          {
            name: "admin",
          },
          {
            name: "operator",
          },
          {
            name: "superadmin",
          },
          {
            name: "partner",
          },
        ]
      },
      expectedResult:  [{"name": "admin"}, {"name": "operator"}, {"name": "partner"}, {"name": "superadmin"}, {"name": "user"}],
    },
    {
      args: {
        policies: [
          {
            name: "user",
          },
          {
            name: "admin",
          },
          {
            name: "operator",
          },
          {
            name: "",
          },
        ]
      },
      expectedResult:  [{"name": ""}, {"name": "admin"}, {"name": "operator"}, {"name": "user"}],
    },
    {
      args: {
        policies: [
          {
            name: "user",
          },
          {
            name: "admin",
          },
          {
            name: "operator",
          },
          {
            name: null,
          },
        ]
      },
      expectedResult:  [{"name": "admin"}, {"name": "operator"}, {"name": "user"}, {"name": null}],
    }
  ];
  testCases.forEach((test) => {
    const policies = test.args.policies;
    const result = test.expectedResult;
    expect(policies.sort(policySort)).toEqual(result);
  })
});

it('stringSort function', () => {
  const testCases = [
    {
      args: {
        strings: ["user","admin","operator","superadmin"]
      },
      expectedResult:  ["admin","operator","superadmin","user"],
    },
    {
      args: {
        strings: ["user","admin","operator",""],
      },
      expectedResult:  ["","admin","operator","user"],
    },
    {
      args: {
        strings: ["user","admin","operator",null],
      },
      expectedResult:  ["admin","operator","user",null],
    }
  ];
  testCases.forEach((test) => {
    const strings = test.args.strings;
    const result = test.expectedResult;
    expect(strings.sort(stringSort)).toEqual(result);
  })
});
