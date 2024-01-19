// This file is part of MinIO Console Server
// Copyright (c) 2023 MinIO, Inc.
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

export const extractFileExtn = (resourceStr: string) => {
  //file extensions may contain query string. so exclude query strings !
  return (resourceStr.match(/\.([^.]*?)(?=\?|#|$)/) || [])[1];
};
export const getPolicyAllowedFileExtensions = (
  sessionGrants: Record<string, string[]>,
  uploadPath: string,
  scopes: string[] = [],
) => {
  const sessionGrantWildCards = getSessionGrantsWildCard(
    sessionGrants,
    uploadPath,
    scopes,
  );

  //get acceptable files if any in the policy.
  const allowedFileExtensions = sessionGrantWildCards.reduce(
    (acc: string[], cv: string) => {
      const extension: string = extractFileExtn(cv);
      if (extension) {
        acc.push(`.${extension}`); //strict extension matching.
      }
      return acc;
    },
    [],
  );

  const uniqueExtensions = [...new Set(allowedFileExtensions)];
  return uniqueExtensions.join(",");
};

// The resource should not have the extensions (*.ext) for the hasPermission to work.
// so sanitize this and also use to extract the allowed extensions outside of permission check.
export const getSessionGrantsWildCard = (
  sessionGrants: Record<string, string[]>,
  uploadPath: string,
  scopes: string[] = [],
) => {
  //get only the path matching grants to reduce processing.
  const grantsWithExtension = Object.keys(sessionGrants).reduce(
    (acc: Record<string, string[]>, grantKey: string) => {
      if (extractFileExtn(grantKey) && grantKey.includes(uploadPath)) {
        acc[grantKey] = sessionGrants[grantKey];
      }
      return acc;
    },
    {},
  );

  const checkPathsForPermission = (sessionGrantKey: string) => {
    const grantActions = grantsWithExtension[sessionGrantKey];
    const hasScope = grantActions.some((actionKey) =>
      scopes.find((scopeKey) => {
        let wildCardMatch = false;
        const hasWildCard = scopeKey.indexOf("*") !== -1;
        if (hasWildCard) {
          const scopeActionKey = scopeKey.substring(0, scopeKey.length - 1);

          wildCardMatch = actionKey.includes(scopeActionKey);
        }

        return wildCardMatch || actionKey === scopeKey;
      }),
    );

    const sessionGrantKeyPath = sessionGrantKey.substring(
      0,
      sessionGrantKey.indexOf("/*."), //start of extension part.
    );
    const isUploadPathMatching =
      sessionGrantKeyPath === `arn:aws:s3:::${uploadPath}`;

    const hasGrant =
      isUploadPathMatching && sessionGrantKey !== "arn:aws:s3:::*";

    return hasScope && hasGrant;
  };

  return Object.keys(grantsWithExtension).filter(checkPathsForPermission);
};
