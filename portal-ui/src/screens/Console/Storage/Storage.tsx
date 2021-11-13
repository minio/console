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

import React, { Fragment, useEffect, useState } from "react";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { Link, Redirect, Route, Router, Switch } from "react-router-dom";
import {
  actionsTray,
  containerForHeader,
  pageContentStyles,
  searchField,
} from "../Common/FormComponents/common/styleLibrary";
import history from "../../../history";
import PageHeader from "../Common/PageHeader/PageHeader";
import StoragePVCs from "./StoragePVCs";
import DirectCSIDrives from "../DirectCSI/DirectCSIDrives";
import PageLayout from "../Common/Layout/PageLayout";
import VerticalTabs from "../Common/VerticalTabs/VerticalTabs";

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
    pageContainer: {
      border: "1px solid #EAEAEA",
      height: "100%",
    },
    ...pageContentStyles,
    ...actionsTray,
    ...searchField,
    ...containerForHeader(theme.spacing(4)),
  });

const routes = ["/storage/volumes", "/storage/drives"];

const Storage = ({ classes, match }: IStorageProps) => {
  let selTab = match?.path;
  selTab = selTab ? selTab : routes[0];

  const [activeTab, setActiveTab] = useState(selTab);

  useEffect(() => {
    setActiveTab(selTab);
  }, [selTab]);

  return (
    <Fragment>
      <PageHeader label={"Storage"} />
      <PageLayout className={classes.pageContainer}>
        <VerticalTabs
          selectedTab={activeTab}
          isRouteTabs
          routes={
            <div className={classes.contentSpacer}>
              <Router history={history}>
                <Switch>
                  <Route exact path={routes[0]} component={StoragePVCs} />
                  <Route exact path={routes[1]} component={DirectCSIDrives} />
                  <Route render={() => <Redirect to={routes[0]} />} />
                </Switch>
              </Router>
            </div>
          }
        >
          {{
            tabConfig: {
              label: "Volumes",
              value: routes[0],
              component: Link,
              to: routes[0],
            },
          }}
          {{
            tabConfig: {
              label: "Drives",
              value: routes[1],
              component: Link,
              to: routes[1],
            },
          }}
        </VerticalTabs>
      </PageLayout>
    </Fragment>
  );
};

export default withStyles(styles)(Storage);
