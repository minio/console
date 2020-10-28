// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";
import { removeRouteLevel } from "./actions";
import { ObjectBrowserState, Route } from "./reducers";
import { objectBrowserCommon } from "../Common/FormComponents/common/styleLibrary";
import { Link } from "react-router-dom";

interface ObjectBrowserReducer {
  objectBrowser: ObjectBrowserState;
}

interface IObjectBrowser {
  classes: any;
  objectsList: Route[];
  removeRouteLevel: (path: string) => any;
}

const styles = (theme: Theme) =>
  createStyles({
    ...objectBrowserCommon,
  });

const BrowserBreadcrumbs = ({
  classes,
  objectsList,
  removeRouteLevel,
}: IObjectBrowser) => {
  const listBreadcrumbs = objectsList.map((objectItem, index) => {
    return (
      <React.Fragment key={`breadcrumbs-${index.toString()}`}>
        <Link
          to={objectItem.route}
          onClick={() => {
            removeRouteLevel(objectItem.route);
          }}
        >
          {objectItem.label}
        </Link>
        {index < objectsList.length - 1 && <span> / </span>}
      </React.Fragment>
    );
  });

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <div className={classes.sectionTitle}>
          {objectsList && objectsList.length > 0
            ? objectsList.slice(-1)[0].label
            : ""}
        </div>
      </Grid>
      <Grid item xs={12} className={classes.breadcrumbs}>
        {listBreadcrumbs}
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ objectBrowser }: ObjectBrowserReducer) => ({
  objectsList: get(objectBrowser, "routesList", []),
});

const mapDispatchToProps = {
  removeRouteLevel,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(withStyles(styles)(BrowserBreadcrumbs));
