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

import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { safeDecodeURIComponent } from "../../../common/utils";
import {
  Button,
  CopyIcon,
  NewPathIcon,
  Tooltip,
  Breadcrumbs,
  breakPoints,
  Box,
} from "mds";
import { hasPermission } from "../../../common/SecureComponent";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../common/SecureComponent/permissions";
import withSuspense from "../Common/Components/withSuspense";
import { setSnackBarMessage } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { setVersionsModeEnabled } from "./objectBrowserSlice";
import { getSessionGrantsWildCard } from "../Buckets/ListBuckets/UploadPermissionUtils";

const CreatePathModal = withSuspense(
  React.lazy(
    () => import("../Buckets/ListBuckets/Objects/ListObjects/CreatePathModal"),
  ),
);

const BreadcrumbsMain = styled.div(() => ({
  display: "flex",
  "& .additionalOptions": {
    paddingRight: "10px",
    display: "flex",
    alignItems: "center",
    [`@media (max-width: ${breakPoints.lg}px)`]: {
      display: "none",
    },
  },
  "& .slashSpacingStyle": {
    margin: "0 5px",
  },
}));

interface IObjectBrowser {
  bucketName: string;
  internalPaths: string;
  hidePathButton?: boolean;
  additionalOptions?: React.ReactNode;
}

const BrowserBreadcrumbs = ({
  bucketName,
  internalPaths,
  hidePathButton,
  additionalOptions,
}: IObjectBrowser) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled,
  );
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode,
  );
  const versionedFile = useSelector(
    (state: AppState) => state.objectBrowser.versionedFile,
  );
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode,
  );

  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);
  const [canCreateSubpath, setCanCreateSubpath] = useState<boolean>(false);

  const putObjectPermScopes = [
    IAM_SCOPES.S3_PUT_OBJECT,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ];

  const sessionGrants = useSelector((state: AppState) =>
    state.console.session ? state.console.session.permissions || {} : {},
  );

  let paths = internalPaths;

  if (internalPaths !== "") {
    paths = `/${internalPaths}`;
  }

  const splitPaths = paths.split("/").filter((path) => path !== "");
  const lastBreadcrumbsIndex = splitPaths.length - 1;

  const pathToCheckPerms = bucketName + paths || bucketName;
  const sessionGrantWildCards = getSessionGrantsWildCard(
    sessionGrants,
    pathToCheckPerms,
    putObjectPermScopes,
  );

  useEffect(() => {
    setCanCreateSubpath(false);
    Object.keys(sessionGrants).forEach((grant) => {
      grant.includes(pathToCheckPerms) &&
        grant.includes("/*") &&
        setCanCreateSubpath(true);
    });
  }, [pathToCheckPerms, internalPaths, sessionGrants]);

  const canCreatePath =
    hasPermission(
      [pathToCheckPerms, ...sessionGrantWildCards],
      putObjectPermScopes,
    ) ||
    anonymousMode ||
    canCreateSubpath;

  let breadcrumbsMap = splitPaths.map((objectItem: string, index: number) => {
    const subSplit = `${splitPaths.slice(0, index + 1).join("/")}/`;
    const route = `/browser/${encodeURIComponent(bucketName)}/${
      subSplit ? `${encodeURIComponent(subSplit)}` : ``
    }`;

    if (index === lastBreadcrumbsIndex && objectItem === versionedFile) {
      return null;
    }

    return (
      <Fragment key={`breadcrumbs-${index.toString()}`}>
        <span className={"slashSpacingStyle"}>/</span>
        {index === lastBreadcrumbsIndex ? (
          <span style={{ cursor: "default", whiteSpace: "pre" }}>
            {safeDecodeURIComponent(objectItem) /*Only for display*/}
          </span>
        ) : (
          <Link
            style={{
              whiteSpace: "pre",
            }}
            to={route}
            onClick={() => {
              dispatch(
                setVersionsModeEnabled({ status: false, objectName: "" }),
              );
            }}
          >
            {
              safeDecodeURIComponent(
                objectItem,
              ) /*Only for display to preserve */
            }
          </Link>
        )}
      </Fragment>
    );
  });

  let versionsItem: any[] = [];

  if (versionsMode) {
    versionsItem = [
      <Fragment key={`breadcrumbs-versionedItem`}>
        <span>
          <span className={"slashSpacingStyle"}>/</span>
          {versionedFile} - Versions
        </span>
      </Fragment>,
    ];
  }

  const listBreadcrumbs: any[] = [
    <Fragment key={`breadcrumbs-root-path`}>
      <Link
        to={`/browser/${bucketName}`}
        onClick={() => {
          dispatch(setVersionsModeEnabled({ status: false, objectName: "" }));
        }}
      >
        {bucketName}
      </Link>
    </Fragment>,
    ...breadcrumbsMap,
    ...versionsItem,
  ];

  const closeAddFolderModal = () => {
    setCreateFolderOpen(false);
  };

  const goBackFunction = () => {
    if (versionsMode) {
      dispatch(setVersionsModeEnabled({ status: false, objectName: "" }));
    } else {
      if (splitPaths.length === 0) {
        return;
      }

      const prevPath = splitPaths.slice(0, -1);

      navigate(
        `/browser/${bucketName}${
          prevPath.length > 0
            ? `/${encodeURIComponent(`${prevPath.join("/")}/`)}`
            : ""
        }`,
      );
    }
  };

  return (
    <Fragment>
      <BreadcrumbsMain>
        {createFolderOpen && (
          <CreatePathModal
            modalOpen={createFolderOpen}
            bucketName={bucketName}
            folderName={internalPaths}
            onClose={closeAddFolderModal}
            limitedSubPath={
              canCreateSubpath &&
              !(
                hasPermission(
                  [pathToCheckPerms, ...sessionGrantWildCards],
                  putObjectPermScopes,
                ) || anonymousMode
              )
            }
          />
        )}
        <Breadcrumbs
          sx={{
            whiteSpace: "pre",
          }}
          goBackFunction={goBackFunction}
          additionalOptions={
            <Fragment>
              <CopyToClipboard text={`${bucketName}/${splitPaths.join("/")}`}>
                <Button
                  id={"copy-path"}
                  icon={
                    <CopyIcon
                      style={{
                        width: "12px",
                        height: "12px",
                        fill: "#969FA8",
                        marginTop: -1,
                      }}
                    />
                  }
                  variant={"regular"}
                  onClick={() => {
                    dispatch(setSnackBarMessage("Path copied to clipboard"));
                  }}
                  style={{
                    width: "28px",
                    height: "28px",
                    color: "#969FA8",
                    border: "#969FA8 1px solid",
                    marginRight: 5,
                  }}
                />
              </CopyToClipboard>
              <Box className={"additionalOptions"}>{additionalOptions}</Box>
            </Fragment>
          }
        >
          {listBreadcrumbs}
        </Breadcrumbs>
        {!hidePathButton && (
          <Tooltip
            tooltip={
              canCreatePath
                ? "Choose or create a new path"
                : permissionTooltipHelper(
                    [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
                    "create a new path",
                  )
            }
          >
            <Button
              id={"new-path"}
              onClick={() => {
                setCreateFolderOpen(true);
              }}
              disabled={anonymousMode ? false : rewindEnabled || !canCreatePath}
              icon={<NewPathIcon style={{ fill: "#969FA8" }} />}
              style={{
                whiteSpace: "nowrap",
              }}
              variant={"regular"}
              label={"Create new path"}
            />
          </Tooltip>
        )}
      </BreadcrumbsMain>
      <Box
        sx={{
          display: "none",
          marginTop: 15,
          marginBottom: 5,
          justifyContent: "flex-start",
          "& > div": {
            fontSize: 12,
            fontWeight: "normal",
            flexDirection: "row",
            flexWrap: "nowrap",
          },
          [`@media (max-width: ${breakPoints.lg}px)`]: {
            display: "flex",
          },
        }}
      >
        {additionalOptions}
      </Box>
    </Fragment>
  );
};

export default BrowserBreadcrumbs;
