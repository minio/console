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

import React, { Fragment, useState, useEffect } from "react";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { Grid, ListItem, ListItemText } from "@material-ui/core";
import { Route, Router, Switch, Redirect } from "react-router-dom";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import history from "../../../history";
import PageHeader from "../Common/PageHeader/PageHeader";
import StoragePVCs from "./StoragePVCs";
import DirectCSIDrives from "../DirectCSI/DirectCSIDrives";
import List from "@material-ui/core/List";

interface IStorageProps {
  classes: any;
  match: any;
}

const styles = (theme: Theme) =>
  createStyles({
    headerLabel: {
      fontSize: 22,
      fontWeight: 600,
      color: "#000",
      marginTop: 4,
    },
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

const routes = ["/storage/volumes", "/storage/drives"];

const Storage = ({ classes, match }: IStorageProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  useEffect(() => {
    const index = routes.findIndex((route) => route === match.path);
    setSelectedTab(index);
  }, [match]);

  const routeChange = (newValue: number) => {
    history.push(routes[newValue]);
  };

  return (
    <Fragment>
      <PageHeader label={"Storage"} />
      <Grid container className={classes.container}>
        <Grid item xs={2}>
          <List component="nav" dense={true}>
            <ListItem
              button
              selected={selectedTab === 0}
              onClick={() => {
                routeChange(0);
              }}
            >
              <ListItemText primary="Volumes" />
            </ListItem>
            <ListItem
              button
              selected={selectedTab === 1}
              onClick={() => {
                routeChange(1);
              }}
            >
              <ListItemText primary="Drives" />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={10}>
          <Router history={history}>
            <Switch>
              <Route path={routes[0]} component={StoragePVCs} />
              <Route path={routes[1]} component={DirectCSIDrives} />
              <Route render={() => <Redirect to="/storage/volumes" />} />
            </Switch>
          </Router>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(Storage);
