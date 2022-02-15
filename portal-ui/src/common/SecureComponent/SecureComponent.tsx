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
import get from "lodash/get";
import { store } from "../../store";
import { hasAccessToResource } from "./permissions";

export const hasPermission = (
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

        if(inRegExp.exec(path)) {
          return element;
        }

        return null;
      });

      return items.filter(itm => itm !== null);
    };

    resources.forEach((rsItem) => {
      // Validation against inner paths & wildcards
      let wildcardRules =getMatchingWildcards(rsItem);

      let wildcardGrants: string[] = [];

      wildcardRules.forEach((rule) => {
        if(rule) {
          const wcResources = get(sessionGrants, rule, []);
          wildcardGrants = [...wildcardGrants, ...wcResources];
        }
      });

      const simpleResources = get(sessionGrants, rsItem, []);
      const s3Resources = get(sessionGrants, `arn:aws:s3:::${rsItem}/*`, []);

      resourceGrants = [...simpleResources, ...s3Resources, ...wildcardGrants];

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

interface ISecureComponentProps {
  errorProps?: any;
  RenderError?: any;
  matchAll?: boolean;
  children: any;
  scopes: string[];
  resource: string | string[];
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
