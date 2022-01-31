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

import React, { cloneElement } from "react";
import { store } from "../../store";
import { hasAccessToResource } from "./permissions";

export const hasPermission = (
  resource: string | undefined,
  scopes: string[],
  matchAll?: boolean,
  containsResource?: boolean
) => {
  if (!resource) {
    return false;
  }
  const state = store.getState();
  const sessionGrants = state.console.session.permissions || {};
  const resourceGrants =
    sessionGrants[resource] ||
    sessionGrants[`arn:aws:s3:::${resource}/*`] ||
    [];
  const globalGrants = sessionGrants["arn:aws:s3:::*"] || [];
  let containsResourceGrants: string[] = [];
  if (containsResource) {
    const matchResource = `arn:aws:s3:::${resource}`;
    for (const [key, value] of Object.entries(sessionGrants)) {
      if (key.includes(matchResource)) {
        containsResourceGrants = containsResourceGrants.concat(value);
      }
    }
  }
  return hasAccessToResource(
    [...resourceGrants, ...globalGrants, ...containsResourceGrants],
    scopes,
    matchAll
  );
};

interface ISecureComponentProps {
  errorProps?: any;
  RenderError?: any;
  matchAll?: boolean;
  children: any;
  scopes: string[];
  resource: string;
  containsResource?: boolean;
}

const SecureComponent = ({
  children,
  RenderError = () => <></>,
  errorProps = null,
  matchAll = false,
  scopes = [],
  resource,
  containsResource = false,
}: ISecureComponentProps) => {
  const permissionGranted = hasPermission(
    resource,
    scopes,
    matchAll,
    containsResource
  );
  if (!permissionGranted && !errorProps) return <RenderError />;
  if (!permissionGranted && errorProps) {
    return Array.isArray(children) ? (
      <>{children.map((child) => cloneElement(child, { ...errorProps }))}</>
    ) : (
      cloneElement(children, { ...errorProps })
    );
  }
  return <>{children}</>;
};

export default SecureComponent;
