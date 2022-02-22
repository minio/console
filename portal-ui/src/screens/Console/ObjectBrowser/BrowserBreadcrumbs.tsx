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

import React, { Fragment, useState } from "react";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import { connect } from "react-redux";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { ObjectBrowserState } from "./reducers";
import { objectBrowserCommon } from "../Common/FormComponents/common/styleLibrary";
import { Link } from "react-router-dom";
import { encodeFileName } from "../../../common/utils";
import { BackCaretIcon, FolderIcon } from "../../../icons";
import { IconButton, Tooltip } from "@mui/material";
import history from "../../../history";
import { hasPermission } from "../../../common/SecureComponent";
import { IAM_SCOPES } from "../../../common/SecureComponent/permissions";
import withSuspense from "../Common/Components/withSuspense";
import { BucketObject } from "../Buckets/ListBuckets/Objects/ListObjects/types";

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
  rewindDate?: any;
  existingFiles: BucketObject[];
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
  rewindDate,
  existingFiles,
}: IObjectBrowser) => {
  const [createFolderOpen, setCreateFolderOpen] = useState<boolean>(false);

  let paths = internalPaths;

  if (internalPaths !== "") {
    paths = `/${internalPaths}`;
  }

  const splitPaths = paths.split("/").filter((path) => path !== "");
  let breadcrumbsMap = splitPaths.map((objectItem: string, index: number) => {
    const subSplit = splitPaths.slice(0, index + 1).join("/");
    const route = `/buckets/${bucketName}/browse/${
      subSplit ? `${encodeFileName(subSplit)}` : ``
    }`;
    return (
      <Fragment key={`breadcrumbs-${index.toString()}`}>
        <span> / </span>
        <Link to={route}>{objectItem}</Link>
      </Fragment>
    );
  });

  const listBreadcrumbs: any[] = [
    <Fragment key={`breadcrumbs-root-path`}>
      <Link to={`/buckets/${bucketName}/browse`}>{bucketName}</Link>
    </Fragment>,
    ...breadcrumbsMap,
  ];

  const closeAddFolderModal = () => {
    setCreateFolderOpen(false);
  };

  return (
    <React.Fragment>
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
          onClick={() => {
            history.goBack();
          }}
          sx={{
            border: "#EAEDEE 1px solid",
            backgroundColor: "#fff",
            borderLeft: 0,
            borderBottom: 0,
            borderRadius: 0,
            width: 39,
            height: 39,
            marginRight: "10px",
          }}
        >
          <BackCaretIcon />
        </IconButton>
        <Tooltip title={"Choose or create a new path"}>
          <IconButton
            id={"new-path"}
            onClick={() => {
              setCreateFolderOpen(true);
            }}
            disabled={
              rewindEnabled ||
              !hasPermission(bucketName, [IAM_SCOPES.S3_PUT_OBJECT])
            }
            disableTouchRipple
            disableRipple
            focusRipple={false}
            sx={{
              padding: 0,
              paddingLeft: "6px",
            }}
          >
            <FolderIcon />
          </IconButton>
        </Tooltip>
        <div className={classes.breadcrumbsList} dir="rtl">
          {listBreadcrumbs}
        </div>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ objectBrowser }: ObjectBrowserReducer) => ({
  rewindEnabled: get(objectBrowser, "rewind.rewindEnabled", false),
  rewindDate: get(objectBrowser, "rewind.dateToRewind", null),
});

const connector = connect(mapStateToProps, null);

export default withStyles(styles)(connector(BrowserBreadcrumbs));
