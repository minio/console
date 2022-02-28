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

import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid, IconButton, Tooltip } from "@mui/material";
import get from "lodash/get";
import { AppState } from "../../../../store";
import { containerForHeader } from "../../Common/FormComponents/common/styleLibrary";
import {
  setSearchObjects,
  setVersionsModeEnabled,
  setSearchVersions,
} from "../../ObjectBrowser/actions";
import ListObjects from "../ListBuckets/Objects/ListObjects/ListObjects";
import PageHeader from "../../Common/PageHeader/PageHeader";
import SettingsIcon from "../../../../icons/SettingsIcon";
import { BucketInfo } from "../types";
import { setErrorSnackMessage } from "../../../../actions";
import { SecureComponent } from "../../../../common/SecureComponent";
import {
  IAM_PERMISSIONS,
  IAM_ROLES,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import SearchBox from "../../Common/SearchBox";
import BackLink from "../../../../common/BackLink";

interface IBrowserHandlerProps {
  versionsMode: boolean;
  match: any;
  history: any;
  classes: any;
  setVersionsModeEnabled: typeof setVersionsModeEnabled;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  bucketInfo: BucketInfo | null;
  searchObjects: string;
  versionedFile: string;
  searchVersions: string;
  setSearchObjects: typeof setSearchObjects;
  setSearchVersions: typeof setSearchVersions;
}

const styles = (theme: Theme) =>
  createStyles({
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    backToBuckets: {
      color: "#000",
      fontSize: 14,
      padding: 0,
      marginTop: -8,
    },
    ...containerForHeader(theme.spacing(4)),
  });

const BrowserHandler = ({
  versionsMode,
  match,
  history,
  classes,
  setVersionsModeEnabled,
  searchObjects,
  setSearchObjects,
  setSearchVersions,
  versionedFile,
  searchVersions,
}: IBrowserHandlerProps) => {
  const bucketName = match.params["bucketName"];
  const internalPaths = get(match.params, "subpaths", "");

  useEffect(() => {
    setVersionsModeEnabled(false);
  }, [internalPaths, setVersionsModeEnabled]);

  const openBucketConfiguration = () => {
    history.push(`/buckets/${bucketName}/admin`);
  };

  return (
    <Fragment>
      <PageHeader
        label={
          <BackLink
            label={"Back to Buckets"}
            to={"/buckets"}
            className={classes.backToBuckets}
          />
        }
        actions={
          <SecureComponent
            scopes={IAM_PERMISSIONS[IAM_ROLES.BUCKET_ADMIN]}
            resource={bucketName}
            errorProps={{ disabled: true }}
          >
            <Tooltip title={"Configure Bucket"}>
              <IconButton
                color="primary"
                aria-label="Configure Bucket"
                component="span"
                onClick={openBucketConfiguration}
                size="large"
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </SecureComponent>
        }
        middleComponent={
          <Fragment>
            {!versionsMode ? (
              <SecureComponent
                scopes={[IAM_SCOPES.S3_LIST_BUCKET]}
                resource={bucketName}
                errorProps={{ disabled: true }}
              >
                <SearchBox
                  placeholder={"Start typing to filter objects in the bucket"}
                  onChange={(value) => {
                    setSearchObjects(value);
                  }}
                  value={searchObjects}
                />
              </SecureComponent>
            ) : (
              <Fragment>
                <SearchBox
                  placeholder={`Start typing to filter versions of ${versionedFile}`}
                  onChange={(value) => {
                    setSearchVersions(value);
                  }}
                  value={searchVersions}
                />
              </Fragment>
            )}
          </Fragment>
        }
      />
      <Grid>
        <ListObjects />
      </Grid>
    </Fragment>
  );
};

const mapStateToProps = ({ objectBrowser, buckets }: AppState) => ({
  versionsMode: get(objectBrowser, "versionsMode", false),
  bucketToRewind: get(objectBrowser, "rewind.bucketToRewind", ""),
  bucketInfo: buckets.bucketDetails.bucketInfo,
  searchObjects: objectBrowser.searchObjects,
  versionedFile: objectBrowser.versionedFile,
  searchVersions: objectBrowser.searchVersions,
});

const mapDispatchToProps = {
  setVersionsModeEnabled,
  setErrorSnackMessage,
  setSearchObjects,
  setSearchVersions,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(styles)(connector(BrowserHandler));
