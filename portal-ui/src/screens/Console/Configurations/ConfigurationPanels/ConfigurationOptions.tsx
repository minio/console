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

import React, { Fragment } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";

import { configurationElements } from "../utils";
import {
  actionsTray,
  containerForHeader,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import PageHeader from "../../Common/PageHeader/PageHeader";
import HelpBox from "../../../../common/HelpBox";
import { SettingsIcon } from "../../../../icons";
import { Link, Redirect, Route, Router, Switch } from "react-router-dom";
import history from "../../../../history";
import VerticalTabs from "../../Common/VerticalTabs/VerticalTabs";
import PageLayout from "../../Common/Layout/PageLayout";
import get from "lodash/get";
import ScreenTitle from "../../Common/ScreenTitle/ScreenTitle";

import withSuspense from "../../Common/Components/withSuspense";
import { IAM_PAGES } from "../../../../common/SecureComponent/permissions";

const ConfigurationForm = withSuspense(
  React.lazy(() => import("./ConfigurationForm"))
);

interface IConfigurationOptions {
  classes: any;
  match: any;
}

const styles = (theme: Theme) =>
  createStyles({
    settingsOptionsContainer: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "flex-start" as const,
      flexWrap: "wrap" as const,
      border: "#E5E5E5 1px solid",
      borderRadius: 2,
      backgroundColor: "#fff",
    },
    ...searchField,
    ...actionsTray,
    ...containerForHeader(theme.spacing(4)),
  });

const getRoutePath = (path: string) => {
  return `${IAM_PAGES.SETTINGS}/${path}`;
};

const ConfigurationOptions = ({ classes, match }: IConfigurationOptions) => {
  const configurationName = get(match, "url", "");
  let selConfigTab = configurationName.substring(
    configurationName.lastIndexOf("/") + 1
  );
  selConfigTab = selConfigTab === "settings" ? "region" : selConfigTab;

  return (
    <Fragment>
      <PageHeader label={"Settings"} />

      <PageLayout>
        <Grid item xs={12}>
          <div
            id="settings-container"
            className={classes.settingsOptionsContainer}
          >
            <ScreenTitle icon={<SettingsIcon />} title={"Configuration:"} />
            <VerticalTabs
              selectedTab={selConfigTab}
              isRouteTabs
              routes={
                <Router history={history}>
                  <Switch>
                    {configurationElements.map((element) => (
                      <Route
                        exact
                        key={`configItem-${element.configuration_label}`}
                        path={`${IAM_PAGES.SETTINGS}/${element.configuration_id}`}
                        component={ConfigurationForm}
                      />
                    ))}
                    <Route exact path={IAM_PAGES.SETTINGS}>
                      <Redirect to={`${IAM_PAGES.SETTINGS}/region`} />
                    </Route>
                  </Switch>
                </Router>
              }
            >
              {configurationElements.map((element) => {
                const { configuration_id, configuration_label, icon } = element;
                return {
                  tabConfig: {
                    label: configuration_label,
                    value: configuration_id,
                    icon: icon,
                    component: Link,
                    to: getRoutePath(configuration_id),
                  },
                };
              })}
            </VerticalTabs>
          </div>
        </Grid>
        <Grid item xs={12} sx={{ paddingTop: "15px" }}>
          <HelpBox
            title={"Learn more about SETTINGS"}
            iconComponent={<SettingsIcon />}
            help={
              <Fragment>
                MinIO supports a variety of configurations ranging from
                encryption, compression, region, notifications, etc.
                <br />
                <br />
                You can learn more at our{" "}
                <a
                  href="https://docs.min.io/minio/baremetal/reference/minio-cli/minio-mc-admin/mc-admin.config.html?ref=con#id4"
                  target="_blank"
                  rel="noreferrer"
                >
                  documentation
                </a>
                .
              </Fragment>
            }
          />
        </Grid>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(ConfigurationOptions);
