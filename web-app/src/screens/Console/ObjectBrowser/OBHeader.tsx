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
import { IAM_SCOPES } from "../../../common/SecureComponent/permissions";
import { SecureComponent } from "../../../common/SecureComponent";
import { Grid } from "mds";
import AutoColorIcon from "../Common/Components/AutoColorIcon";
import { useSelector } from "react-redux";
import { selFeatures } from "../consoleSlice";
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
          label={"Object Browser"}
          actions={
            <Fragment>
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
