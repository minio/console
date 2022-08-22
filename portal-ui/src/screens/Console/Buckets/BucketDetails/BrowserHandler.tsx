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
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Grid } from "@mui/material";
import { AppState, useAppDispatch } from "../../../../store";
import { containerForHeader } from "../../Common/FormComponents/common/styleLibrary";

import ListObjects from "../ListBuckets/Objects/ListObjects/ListObjects";
import PageHeader from "../../Common/PageHeader/PageHeader";
import SettingsIcon from "../../../../icons/SettingsIcon";

import { SecureComponent } from "../../../../common/SecureComponent";
import {
  IAM_PAGES,
  IAM_PERMISSIONS,
  IAM_ROLES,
  IAM_SCOPES,
} from "../../../../common/SecureComponent/permissions";
import BackLink from "../../../../common/BackLink";
import {
  setSearchObjects,
  setSearchVersions,
  setVersionsModeEnabled,
} from "../../ObjectBrowser/objectBrowserSlice";
import SearchBox from "../../Common/SearchBox";
import { selFeatures } from "../../consoleSlice";
import AutoColorIcon from "../../Common/Components/AutoColorIcon";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import { Button } from "mds";

const styles = (theme: Theme) =>
  createStyles({
    ...containerForHeader(theme.spacing(4)),
  });

const BrowserHandler = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode
  );
  const searchObjects = useSelector(
    (state: AppState) => state.objectBrowser.searchObjects
  );
  const versionedFile = useSelector(
    (state: AppState) => state.objectBrowser.versionedFile
  );
  const searchVersions = useSelector(
    (state: AppState) => state.objectBrowser.searchVersions
  );

  const features = useSelector(selFeatures);

  const bucketName = params.bucketName || "";
  const pathSegment = location.pathname.split("/browse/");

  const internalPaths = pathSegment.length === 2 ? pathSegment[1] : "";

  const obOnly = !!features?.includes("object-browser-only");

  useEffect(() => {
    dispatch(setVersionsModeEnabled({ status: false }));
  }, [internalPaths, dispatch]);

  const openBucketConfiguration = () => {
    navigate(`/buckets/${bucketName}/admin`);
  };

  const searchBar = (
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
              dispatch(setSearchObjects(value));
            }}
            value={searchObjects}
          />
        </SecureComponent>
      ) : (
        <Fragment>
          <SearchBox
            placeholder={`Start typing to filter versions of ${versionedFile}`}
            onChange={(value) => {
              dispatch(setSearchVersions(value));
            }}
            value={searchVersions}
          />
        </Fragment>
      )}
    </Fragment>
  );

  return (
    <Fragment>
      {!obOnly ? (
        <PageHeader
          label={<BackLink label={"Buckets"} to={IAM_PAGES.BUCKETS} />}
          actions={
            <SecureComponent
              scopes={IAM_PERMISSIONS[IAM_ROLES.BUCKET_ADMIN]}
              resource={bucketName}
              errorProps={{ disabled: true }}
            >
              <TooltipWrapper tooltip={"Configure Bucket"}>
                <Button
                  id={"configure-bucket-main"}
                  color="primary"
                  aria-label="Configure Bucket"
                  onClick={openBucketConfiguration}
                  icon={
                    <SettingsIcon
                      style={{ width: 20, height: 20, marginTop: -3 }}
                    />
                  }
                  style={{
                    padding: "0 10px",
                  }}
                />
              </TooltipWrapper>
            </SecureComponent>
          }
          middleComponent={searchBar}
        />
      ) : (
        <Grid
          container
          sx={{
            padding: "20px 32px 0",
          }}
        >
          <Grid>
            <AutoColorIcon marginRight={30} marginTop={10} />
          </Grid>
          <Grid item xs>
            {searchBar}
          </Grid>
        </Grid>
      )}
      <Grid>
        <ListObjects />
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(BrowserHandler);
