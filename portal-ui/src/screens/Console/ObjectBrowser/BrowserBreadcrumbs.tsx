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
import { connect } from "react-redux";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import withStyles from "@mui/styles/withStyles";
import createStyles from "@mui/styles/createStyles";
import { Theme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { Button, IconButton, Tooltip } from "@mui/material";
import { ObjectBrowserState } from "./types";
import { objectBrowserCommon } from "../Common/FormComponents/common/styleLibrary";
import { encodeFileName } from "../../../common/utils";
import { BackCaretIcon, NewPathIcon } from "../../../icons";
import { hasPermission } from "../../../common/SecureComponent";
import { IAM_SCOPES } from "../../../common/SecureComponent/permissions";
import { BucketObjectItem } from "../Buckets/ListBuckets/Objects/ListObjects/types";
import { setVersionsModeEnabled } from "./actions";
import history from "../../../history";
import withSuspense from "../Common/Components/withSuspense";

const CreateFolderModal = withSuspense(
  React.lazy(
    () => import("../Buckets/ListBuckets/Objects/ListObjects/CreateFolderModal")
  )
);

interface ObjectBrowserReducer {
  objectBrowser: ObjectBrowserState;
}

interface IObjectBrowser {
  classes: any;
  bucketName: string;
  internalPaths: string;
  rewindEnabled?: boolean;
  versionsMode: boolean;
  versionedFile: string;
  hidePathButton?: boolean;
  existingFiles: BucketObjectItem[];
  additionalOptions?: React.ReactNode;
  setVersionsModeEnabled: typeof setVersionsModeEnabled;
}

const styles = (theme: Theme) =>
  createStyles({
    ...objectBrowserCommon,
  });

const BrowserBreadcrumbs = ({
  classes,
  bucketName,
  internalPaths,
  rewindEnabled,
  existingFiles,
  versionsMode,
  versionedFile,
  hidePathButton,
  setVersionsModeEnabled,
  additionalOptions,
}: IObjectBrowser) => {
  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);

  let paths = internalPaths;

  if (internalPaths !== "") {
    paths = `/${internalPaths}`;
  }

  const splitPaths = paths.split("/").filter((path) => path !== "");
  const lastBreadcrumbsIndex = splitPaths.length - 1;

  let breadcrumbsMap = splitPaths.map((objectItem: string, index: number) => {
    const subSplit = `${splitPaths.slice(0, index + 1).join("/")}/`;
    const route = `/buckets/${bucketName}/browse/${
      subSplit ? `${encodeFileName(subSplit)}` : ``
    }`;

    if (index === lastBreadcrumbsIndex && objectItem === versionedFile) {
      return null;
    }

    return (
      <Fragment key={`breadcrumbs-${index.toString()}`}>
        <span> / </span>
        {index === lastBreadcrumbsIndex ? (
          <span style={{cursor: "default"}}>{objectItem}</span>
        ) : (
          <Link
            to={route}
            onClick={() => {
              setVersionsModeEnabled(false);
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
        <span> / {versionedFile} - Versions</span>
      </Fragment>,
    ];
  }

  const listBreadcrumbs: any[] = [
    <Fragment key={`breadcrumbs-root-path`}>
      <Link
        to={`/buckets/${bucketName}/browse`}
        onClick={() => {
          setVersionsModeEnabled(false);
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
      setVersionsModeEnabled(false);
    } else {
      history.goBack();
    }
  };

  return (
    <div className={classes.breadcrumbsMain}>
      {createFolderOpen && (
        <CreateFolderModal
          modalOpen={createFolderOpen}
          bucketName={bucketName}
          folderName={internalPaths}
          onClose={closeAddFolderModal}
          existingFiles={existingFiles}
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
        <div className={classes.additionalOptions}>{additionalOptions}</div>
      </Grid>
      {!hidePathButton && (
        <Tooltip title={"Choose or create a new path"}>
          <Button
            id={"new-path"}
            onClick={() => {
              setCreateFolderOpen(true);
            }}
            disabled={
              rewindEnabled ||
              !hasPermission(bucketName, [IAM_SCOPES.S3_PUT_OBJECT])
            }
            endIcon={<NewPathIcon />}
            disableTouchRipple
            disableRipple
            focusRipple={false}
            sx={{
              color: "#969FA8",
              border: "#969FA8 1px solid",
              whiteSpace: "nowrap",
              minWidth: "160px",
            }}
            variant={"outlined"}
          >
            Create new path
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

const mapStateToProps = ({ objectBrowser }: ObjectBrowserReducer) => ({
  rewindEnabled: get(objectBrowser, "rewind.rewindEnabled", false),
  versionsMode: get(objectBrowser, "versionsMode", false),
  versionedFile: get(objectBrowser, "versionedFile", ""),
});

const mapDispatchToProps = {
  setVersionsModeEnabled,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(styles)(connector(BrowserBreadcrumbs));
