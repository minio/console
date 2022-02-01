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

import React from "react";
import get from "lodash/get";
import Grid from "@mui/material/Grid";
import Moment from "react-moment";
import { connect } from "react-redux";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import { ObjectBrowserState } from "./reducers";
import { objectBrowserCommon } from "../Common/FormComponents/common/styleLibrary";
import { Link } from "react-router-dom";
import { encodeFileName } from "../../../common/utils";

interface ObjectBrowserReducer {
  objectBrowser: ObjectBrowserState;
}

interface IObjectBrowser {
  classes: any;
  bucketName: string;
  internalPaths: string;
  rewindEnabled?: boolean;
  rewindDate?: any;
  fullSizeBreadcrumbs?: boolean;
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
                                fullSizeBreadcrumbs,
}: IObjectBrowser) => {
  let paths = internalPaths;

  if (internalPaths !== "") {
    paths = `/${internalPaths}`;
  }

  const splitPaths = paths.split("/").filter((path) => path !== "");
  const listBreadcrumbs = splitPaths.map(
    (objectItem: string, index: number) => {
      const subSplit = splitPaths.slice(0, index + 1).join("/");
      const route = `/buckets/${bucketName}/browse/${
        subSplit ? `${encodeFileName(subSplit)}` : ``
      }`;
      return (
        <React.Fragment key={`breadcrumbs-${index.toString()}`}>
          <Link to={route}>{objectItem}</Link>
          {index < splitPaths.length - 1 && <span> / </span>}
        </React.Fragment>
      );
    }
  );

  const title = false;
  return (
    <React.Fragment>
      {title && (
        <Grid item xs={12}>
          <div className={classes.sectionTitle}>
            {splitPaths && splitPaths.length > 0
              ? splitPaths[splitPaths.length - 1]
              : ""}
            {rewindEnabled && splitPaths.length > 1 && (
              <small className={classes.smallLabel}>
                &nbsp;(Rewind:{" "}
                <Moment date={rewindDate} format="MMMM Do YYYY, h:mm a" /> )
              </small>
            )}
          </div>
        </Grid>
      )}

      <Grid item xs={12} className={`${classes.breadcrumbs} ${fullSizeBreadcrumbs ? "fullSize" : ""}`}>
        <React.Fragment>
          <Link to={`/buckets/${bucketName}/browse`}>{bucketName}</Link>
          {listBreadcrumbs.length > 0 && <span> / </span>}
        </React.Fragment>
        {listBreadcrumbs}
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
