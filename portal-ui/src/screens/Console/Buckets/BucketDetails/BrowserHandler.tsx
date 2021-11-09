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
import { Link } from "react-router-dom";
import { Grid, IconButton, Tooltip } from "@mui/material";
import get from "lodash/get";
import { AppState } from "../../../../store";
import { containerForHeader } from "../../Common/FormComponents/common/styleLibrary";
import { setFileModeEnabled } from "../../ObjectBrowser/actions";
import ObjectDetails from "../ListBuckets/Objects/ObjectDetails/ObjectDetails";
import ListObjects from "../ListBuckets/Objects/ListObjects/ListObjects";
import PageHeader from "../../Common/PageHeader/PageHeader";
import { SettingsIcon } from "../../../../icons";
import { BucketInfo } from "../types";
import { setErrorSnackMessage } from "../../../../actions";

interface IBrowserHandlerProps {
  fileMode: boolean;
  match: any;
  history: any;
  classes: any;
  setFileModeEnabled: typeof setFileModeEnabled;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  bucketInfo: BucketInfo | null;
}

const styles = (theme: Theme) =>
  createStyles({
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    ...containerForHeader(theme.spacing(4)),
  });

const BrowserHandler = ({
  fileMode,
  match,
  history,
  classes,
  setFileModeEnabled,
  bucketInfo,
}: IBrowserHandlerProps) => {
  const bucketName = match.params["bucketName"];
  const internalPaths = get(match.params, "subpaths", "");

  useEffect(() => {
    setFileModeEnabled(false);
  }, [internalPaths, setFileModeEnabled]);

  const openBucketConfiguration = () => {
    history.push(`/buckets/${bucketName}/admin`);
  };

  return (
    <Fragment>
      <PageHeader
        label={
          <Fragment>
            <Link to={"/buckets"} className={classes.breadcrumLink}>
              Buckets
            </Link>{" "}
            &gt; {bucketName}
          </Fragment>
        }
        actions={
          bucketInfo?.manage && (
            <Fragment>
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
            </Fragment>
          )
        }
      />
      <Grid container className={classes.container}>
        {fileMode ? <ObjectDetails /> : <ListObjects />}
      </Grid>
    </Fragment>
  );
};

const mapStateToProps = ({ objectBrowser, buckets }: AppState) => ({
  fileMode: get(objectBrowser, "fileMode", false),
  bucketToRewind: get(objectBrowser, "rewind.bucketToRewind", ""),
  bucketInfo: buckets.bucketDetails.bucketInfo,
});

const mapDispatchToProps = {
  setFileModeEnabled,
  setErrorSnackMessage,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(styles)(connector(BrowserHandler));
