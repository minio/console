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
import PageHeader from "../Common/PageHeader/PageHeader";
import { Grid } from "@material-ui/core";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import { containerForHeader } from "../Common/FormComponents/common/styleLibrary";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import ConfigurationsList from "./ConfigurationPanels/ConfigurationsList";
import ListNotificationEndpoints from "./NotificationEndpoints/ListNotificationEndpoints";
import ListTiersConfiguration from "./TiersConfiguration/ListTiersConfiguration";
import { AppState } from "../../../store";
import { connect } from "react-redux";
import { ISessionResponse } from "../types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

interface IConfigurationMain {
  classes: any;
  session: ISessionResponse;
  distributedSetup: boolean;
}

const styles = (theme: Theme) =>
  createStyles({
    headerLabel: {
      fontSize: 22,
      fontWeight: 600,
      color: "#000",
      marginTop: 4,
    },
    ...containerForHeader(theme.spacing(4)),
  });

const ConfigurationMain = ({
  classes,
  session,
  distributedSetup,
}: IConfigurationMain) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <Fragment>
      <PageHeader label="Settings" />
      <Grid container className={classes.container}>
        <Grid item xs={2}>
          <List component="nav" dense={true}>
            <ListItem
              button
              selected={selectedTab === 0}
              onClick={() => {
                setSelectedTab(0);
              }}
            >
              <ListItemText primary="Configurations" />
            </ListItem>
            <ListItem
              button
              selected={selectedTab === 1}
              onClick={() => {
                setSelectedTab(1);
              }}
            >
              <ListItemText primary="Lambda Notifications" />
            </ListItem>
            <ListItem
              button
              selected={selectedTab === 2}
              onClick={() => {
                setSelectedTab(2);
              }}
            >
              <ListItemText primary="Tiers" />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={10}>
          {selectedTab === 0 && (
            <Grid item xs={12}>
              <h1 className={classes.sectionTitle}>Configurations</h1>
              <ConfigurationsList />
            </Grid>
          )}
          {selectedTab === 1 && (
            <Grid item xs={12}>
              <h1 className={classes.sectionTitle}>Lambda Notifications</h1>
              <ListNotificationEndpoints />
            </Grid>
          )}
          {selectedTab === 2 && distributedSetup && (
            <Grid item xs={12}>
              <h1 className={classes.sectionTitle}>Tiers</h1>
              <ListTiersConfiguration />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  session: state.console.session,
  distributedSetup: state.system.distributedSetup,
});

const connector = connect(mapState, {});

export default withStyles(styles)(connector(ConfigurationMain));
