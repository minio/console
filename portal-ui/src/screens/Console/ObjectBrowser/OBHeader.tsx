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

import React, { Fragment, useEffect } from "react";
import {
  IAM_PAGES,
  IAM_PERMISSIONS,
  IAM_ROLES,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { SecureComponent } from "../../../common/SecureComponent";
import TooltipWrapper from "../Common/TooltipWrapper/TooltipWrapper";
import { BackLink, Button, SettingsIcon, Grid } from "mds";
import AutoColorIcon from "../Common/Components/AutoColorIcon";
import { useSelector } from "react-redux";
import { selFeatures } from "../consoleSlice";
import hasPermission from "../../../common/SecureComponent/accessControl";
import { useNavigate } from "react-router-dom";
import SearchBox from "../Common/SearchBox";
import { setSearchVersions } from "./objectBrowserSlice";
import { AppState, useAppDispatch } from "../../../store";
import FilterObjectsSB from "./FilterObjectsSB";
import PageHeaderWrapper from "../Common/PageHeaderWrapper/PageHeaderWrapper";
import ObjectManagerButton from "../Common/ObjectManager/ObjectManagerButton";
import HelpMenu from "../HelpMenu";
import { setHelpName } from "../../../systemSlice";

interface IOBHeader {
  bucketName: string;
}

const OBHeader = ({ bucketName }: IOBHeader) => {
  const dispatch = useAppDispatch();
  const features = useSelector(selFeatures);

  const versionsMode = useSelector(
    (state: AppState) => state.objectBrowser.versionsMode,
  );
  const versionedFile = useSelector(
    (state: AppState) => state.objectBrowser.versionedFile,
  );
  const searchVersions = useSelector(
    (state: AppState) => state.objectBrowser.searchVersions,
  );

  const obOnly = !!features?.includes("object-browser-only");

  const navigate = useNavigate();

  const configureBucketAllowed = hasPermission(bucketName, [
    IAM_SCOPES.S3_GET_BUCKET_POLICY,
    IAM_SCOPES.S3_PUT_BUCKET_POLICY,
    IAM_SCOPES.S3_GET_BUCKET_VERSIONING,
    IAM_SCOPES.S3_PUT_BUCKET_VERSIONING,
    IAM_SCOPES.S3_GET_BUCKET_ENCRYPTION_CONFIGURATION,
    IAM_SCOPES.S3_PUT_BUCKET_ENCRYPTION_CONFIGURATION,
    IAM_SCOPES.S3_DELETE_BUCKET,
    IAM_SCOPES.S3_GET_BUCKET_NOTIFICATIONS,
    IAM_SCOPES.S3_PUT_BUCKET_NOTIFICATIONS,
    IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION,
    IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
    IAM_SCOPES.S3_GET_LIFECYCLE_CONFIGURATION,
    IAM_SCOPES.S3_PUT_LIFECYCLE_CONFIGURATION,
    IAM_SCOPES.ADMIN_GET_BUCKET_QUOTA,
    IAM_SCOPES.ADMIN_SET_BUCKET_QUOTA,
    IAM_SCOPES.S3_PUT_BUCKET_TAGGING,
    IAM_SCOPES.S3_GET_BUCKET_TAGGING,
    IAM_SCOPES.S3_LIST_BUCKET_VERSIONS,
    IAM_SCOPES.S3_GET_BUCKET_POLICY_STATUS,
    IAM_SCOPES.S3_DELETE_BUCKET_POLICY,
    IAM_SCOPES.S3_GET_ACTIONS,
    IAM_SCOPES.S3_PUT_ACTIONS,
  ]);

  const searchBar = (
    <Fragment>
      {!versionsMode ? (
        <SecureComponent
          scopes={[IAM_SCOPES.S3_LIST_BUCKET, IAM_SCOPES.S3_ALL_LIST_BUCKET]}
          resource={bucketName}
          errorProps={{ disabled: true }}
        >
          <FilterObjectsSB />
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

  useEffect(() => {
    dispatch(setHelpName("object_browser"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      {!obOnly ? (
        <PageHeaderWrapper
          label={
            <BackLink
              label={"Object Browser"}
              onClick={() => {
                navigate(IAM_PAGES.OBJECT_BROWSER_VIEW);
              }}
            />
          }
          actions={
            <Fragment>
              <SecureComponent
                scopes={IAM_PERMISSIONS[IAM_ROLES.BUCKET_ADMIN]}
                resource={bucketName}
                errorProps={{ disabled: true }}
              >
                <TooltipWrapper
                  tooltip={
                    configureBucketAllowed
                      ? "Configure Bucket"
                      : "You do not have the required permissions to configure this bucket. Please contact your MinIO administrator to request " +
                        IAM_ROLES.BUCKET_ADMIN +
                        " permisions."
                  }
                >
                  <Button
                    id={"configure-bucket-main"}
                    color="primary"
                    aria-label="Configure Bucket"
                    onClick={() => navigate(`/buckets/${bucketName}/admin`)}
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
              <HelpMenu />
            </Fragment>
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
          <Grid
            item
            xs
            sx={{
              display: "flex",
              gap: 10,
            }}
          >
            {searchBar}
            <ObjectManagerButton />
          </Grid>
        </Grid>
      )}
    </Fragment>
  );
};

export default OBHeader;
