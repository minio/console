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

import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { CSSObject } from "styled-components";
import CopyToClipboard from "react-copy-to-clipboard";
import Grid from "@mui/material/Grid";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material/styles";
import { Link, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import { objectBrowserCommon } from "../Common/FormComponents/common/styleLibrary";
import { encodeURLString } from "../../../common/utils";
import { BackCaretIcon, Button, CopyIcon, NewPathIcon, Tooltip } from "mds";
import { hasPermission } from "../../../common/SecureComponent";
import {
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../common/SecureComponent/permissions";
import withSuspense from "../Common/Components/withSuspense";
import { setSnackBarMessage } from "../../../systemSlice";
import { AppState, useAppDispatch } from "../../../store";
import { setVersionsModeEnabled } from "./objectBrowserSlice";

const CreatePathModal = withSuspense(
  React.lazy(
    () => import("../Buckets/ListBuckets/Objects/ListObjects/CreatePathModal")
  )
);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ...objectBrowserCommon,
    slashSpacingStyle: {
      margin: "0 5px",
    },
  })
);

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
  const classes = useStyles();

  const rewindEnabled = useSelector(
    (state: AppState) => state.objectBrowser.rewind.rewindEnabled
  );
  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode
  );
  const versionedFile = useSelector(
    (state: AppState) => state.objectBrowser.versionedFile
  );
  const anonymousMode = useSelector(
    (state: AppState) => state.system.anonymousMode
  );
  const colorVariants = useSelector(
    (state: AppState) => state.system.overrideStyles
  );

  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);

  const canCreatePath =
    hasPermission(bucketName, [
      IAM_SCOPES.S3_PUT_OBJECT,
      IAM_SCOPES.S3_PUT_ACTIONS,
    ]) || anonymousMode;

  let paths = internalPaths;

  if (internalPaths !== "") {
    paths = `/${internalPaths}`;
  }

  const splitPaths = paths.split("/").filter((path) => path !== "");
  const lastBreadcrumbsIndex = splitPaths.length - 1;

  let breadcrumbsMap = splitPaths.map((objectItem: string, index: number) => {
    const subSplit = `${splitPaths.slice(0, index + 1).join("/")}/`;
    const route = `/browser/${bucketName}/${
      subSplit ? `${encodeURLString(subSplit)}` : ``
    }`;

    if (index === lastBreadcrumbsIndex && objectItem === versionedFile) {
      return null;
    }

    return (
      <Fragment key={`breadcrumbs-${index.toString()}`}>
        <span className={classes.slashSpacingStyle}>/</span>
        {index === lastBreadcrumbsIndex ? (
          <span style={{ cursor: "default" }}>{objectItem}</span>
        ) : (
          <Link
            to={route}
            onClick={() => {
              dispatch(
                setVersionsModeEnabled({ status: false, objectName: "" })
              );
            }}
          >
            {objectItem}
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
          <span className={classes.slashSpacingStyle}>/</span>
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
      navigate(-1);
    }
  };

  let regularButtonOverride: CSSObject = {};

  if (colorVariants) {
    regularButtonOverride = {
      backgroundColor: "transparent",
    };
  }

  return (
    <Fragment>
      <div className={classes.breadcrumbsMain}>
        {createFolderOpen && (
          <CreatePathModal
            modalOpen={createFolderOpen}
            bucketName={bucketName}
            folderName={internalPaths}
            onClose={closeAddFolderModal}
          />
        )}
        <Grid item xs={12} className={`${classes.breadcrumbs}`}>
          <IconButton
            onClick={goBackFunction}
            sx={{
              border: "#EAEDEE 1px solid",
              backgroundColor: "#fff",
              borderLeft: 0,
              borderRadius: 0,
              width: 38,
              height: 38,
              marginRight: "10px",
            }}
          >
            <BackCaretIcon />
          </IconButton>
          <div className={classes.breadcrumbsList} dir="rtl">
            {listBreadcrumbs}
          </div>
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
          <div className={classes.additionalOptions}>{additionalOptions}</div>
        </Grid>
        {!hidePathButton && (
          <Tooltip
            tooltip={
              canCreatePath
                ? "Choose or create a new path"
                : permissionTooltipHelper(
                    [IAM_SCOPES.S3_PUT_OBJECT, IAM_SCOPES.S3_PUT_ACTIONS],
                    "create a new path"
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
              sx={regularButtonOverride}
            />
          </Tooltip>
        )}
      </div>
      <div className={classes.breadcrumbsSecond}>{additionalOptions}</div>
    </Fragment>
  );
};

export default BrowserBreadcrumbs;
