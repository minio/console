// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

import {
  ADMIN_ALL_ACTIONS,
  S3_ALL_ACTIONS,
  S3_GET_BUCKET_OBJECT_LOCK_CONFIGURATION,
  S3_PUT_OBJECT_TAGGING,
} from "../types";

// displayComponent receives a list of user permissions to perform on a specific resource, then compares those permissions against
// a list of required permissions and return true or false depending of the level of required access (match all permissions,
// match some of the permissions)
export const displayComponent = (
  userPermissionsOnBucket: string[] | null | undefined,
  requiredPermissions: string[],
  matchAll?: boolean
) => {
  if (!userPermissionsOnBucket) {
    return false;
  }

  const s3All = userPermissionsOnBucket.includes(S3_ALL_ACTIONS);
  const AdminAll = userPermissionsOnBucket.includes(ADMIN_ALL_ACTIONS);

  const permissions = requiredPermissions.filter(function (n) {
    return (
      userPermissionsOnBucket.indexOf(n) !== -1 ||
      (n.indexOf("s3:") !== -1 && s3All) ||
      (n.indexOf("admin:") !== -1 && AdminAll)
    );
  });
  return matchAll
    ? permissions.length == requiredPermissions.length
    : permissions.length > 0;
};
