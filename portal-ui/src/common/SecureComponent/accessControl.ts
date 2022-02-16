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

import { store } from "../../store";
import get from "lodash/get";
import { IAM_SCOPES } from "./permissions";

const hasPermission = (
  resource: string | string[] | undefined,
  scopes: string[],
  matchAll?: boolean,
  containsResource?: boolean
) => {
  if (!resource) {
    return false;
  }
  const state = store.getState();
  const sessionGrants = state.console.session.permissions || {};

  const globalGrants = sessionGrants["arn:aws:s3:::*"] || [];
  let resources: string[] = [];
  let resourceGrants: string[] = [];
  let containsResourceGrants: string[] = [];

  if (resource) {
    if (Array.isArray(resource)) {
      resources = [...resources, ...resource];
    } else {
      resources.push(resource);
    }

    // Filter wildcard items
    const wildcards = Object.keys(sessionGrants).filter(
      (item) => item.includes("*") && item !== "arn:aws:s3:::*"
    );

    const getMatchingWildcards = (path: string) => {
      const items = wildcards.map((element) => {
        const wildcardItemSection = element.split(":").slice(-1)[0];

        const replaceWildcard = wildcardItemSection
          .replace("/", "\\/")
          .replace("\\/*", "($|(\\/.*?))");

        const inRegExp = new RegExp(`${replaceWildcard}$`, "gm");

        if (inRegExp.exec(path)) {
          return element;
        }

        return null;
      });

      return items.filter((itm) => itm !== null);
    };

    resources.forEach((rsItem) => {
      // Validation against inner paths & wildcards
      let wildcardRules = getMatchingWildcards(rsItem);

      let wildcardGrants: string[] = [];

      wildcardRules.forEach((rule) => {
        if (rule) {
          const wcResources = get(sessionGrants, rule, []);
          wildcardGrants = [...wildcardGrants, ...wcResources];
        }
      });

      const simpleResources = get(sessionGrants, rsItem, []);
      const s3Resources = get(sessionGrants, `arn:aws:s3:::${rsItem}/*`, []);
      const bucketOnly = get(sessionGrants, `arn:aws:s3:::${rsItem}/`, []);
      const bckOnlyNoSlash = get(sessionGrants, `arn:aws:s3:::${rsItem}`, []);

      resourceGrants = [
        ...simpleResources,
        ...s3Resources,
        ...wildcardGrants,
        ...bucketOnly,
        ...bckOnlyNoSlash,
      ];

      if (containsResource) {
        const matchResource = `arn:aws:s3:::${rsItem}`;

        Object.entries(sessionGrants).forEach(([key, value]) => {
          if (key.includes(matchResource)) {
            containsResourceGrants = [...containsResourceGrants, ...value];
          }
        });
      }
    });
  }

  return hasAccessToResource(
    [...resourceGrants, ...globalGrants, ...containsResourceGrants],
    scopes,
    matchAll
  );
};

// hasAccessToResource receives a list of user permissions to perform on a specific resource, then compares those permissions against
// a list of required permissions and return true or false depending of the level of required access (match all permissions,
// match some of the permissions)
const hasAccessToResource = (
  userPermissionsOnBucket: string[] | null | undefined,
  requiredPermissions: string[] = [],
  matchAll?: boolean
) => {
  if (!userPermissionsOnBucket) {
    return false;
  }

  const s3All = userPermissionsOnBucket.includes(IAM_SCOPES.S3_ALL_ACTIONS);
  const AdminAll = userPermissionsOnBucket.includes(
    IAM_SCOPES.ADMIN_ALL_ACTIONS
  );

  const permissions = requiredPermissions.filter(function (n) {
    return (
      userPermissionsOnBucket.indexOf(n) !== -1 ||
      (n.indexOf("s3:") !== -1 && s3All) ||
      (n.indexOf("admin:") !== -1 && AdminAll)
    );
  });
  return matchAll
    ? permissions.length === requiredPermissions.length
    : permissions.length > 0;
};

export default hasPermission;
