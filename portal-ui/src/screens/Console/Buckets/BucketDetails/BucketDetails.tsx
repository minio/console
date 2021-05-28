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
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { createStyles, Theme, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import api from "../../../../common/api";
import { HasPermissionResponse } from "../types";
import {
  actionsTray,
  buttonsStyles,
  containerForHeader,
  hrClass,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../actions";
import { setBucketDetailsTab } from "../actions";
import { AppState } from "../../../../store";
import { ISessionResponse } from "../../types";
import PageHeader from "../../Common/PageHeader/PageHeader";
import AccessDetailsPanel from "./AccessDetailsPanel";
import BucketSummaryPanel from "./BucketSummaryPanel";
import BucketEventsPanel from "./BucketEventsPanel";
import BucketReplicationPanel from "./BucketReplicationPanel";
import BucketLifecyclePanel from "./BucketLifecyclePanel";

const styles = (theme: Theme) =>
  createStyles({
    seeMore: {
      marginTop: theme.spacing(3),
    },
    paper: {
      display: "flex",
      overflow: "auto",
      flexDirection: "column",
    },
    addSideBar: {
      width: "320px",
      padding: "20px",
    },
    tableToolbar: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(0),
    },
    minTableHeader: {
      color: "#393939",
      "& tr": {
        "& th": {
          fontWeight: "bold",
        },
      },
    },
    noRecords: {
      lineHeight: "24px",
      textAlign: "center",
      padding: "20px",
    },
    gridWrapper: {
      width: 320,
    },
    gridContainer: {
      display: "grid",
      gridTemplateColumns: "auto auto",
      gridGap: 8,
      justifyContent: "flex-start",
      alignItems: "center",
      "& div:not(.MuiCircularProgress-root)": {
        display: "flex",
        alignItems: "center",
      },
      "& div:nth-child(odd)": {
        justifyContent: "flex-end",
        fontWeight: 700,
      },
      "& div:nth-child(2n)": {
        minWidth: 150,
      },
    },
    masterActions: {
      width: "25%",
      minWidth: "120px",
      "& div": {
        margin: "5px 0px",
      },
    },

    headerContainer: {
      display: "flex",
      justifyContent: "space-between",
    },
    capitalizeFirst: {
      textTransform: "capitalize",
    },
    doubleElement: {
      display: "flex",
      justifyContent: "space-between",
    },
    encCheckbox: {
      margin: 0,
      padding: 0,
    },
    tabPan: {
      marginTop: "5px",
    },
    fixedHeight: {
      height: 165,
      minWidth: 247,
      padding: "25px 28px",
      "& svg": {
        maxHeight: 18,
      },
    },
    routerContainer: {
      marginTop: 5,
    },
    titleCol: {
      fontWeight: "bold",
    },
    ...searchField,
    ...actionsTray,
    actionsTray: {
      ...actionsTray.actionsTray,
      padding: "15px 0 0",
    },
    ...hrClass,
    ...buttonsStyles,
    ...containerForHeader(theme.spacing(4)),
  });

interface IBucketDetailsProps {
  classes: any;
  match: any;
  history: any;
  session: ISessionResponse;
  selectedTab: string;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setBucketDetailsTab: typeof setBucketDetailsTab;
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const BucketDetails = ({
  classes,
  match,
  history,
  session,
  selectedTab,
  setErrorSnackMessage,
  setBucketDetailsTab,
}: IBucketDetailsProps) => {
  const [loadingPerms, setLoadingPerms] = useState<boolean>(true);
  const [canGetReplication, setCanGetReplication] = useState<boolean>(false);
  const bucketName = match.params["bucketName"];

  useEffect(() => {
    let matchURL = match.params ? match.params["0"] : "summary";

    if (!matchURL) {
      matchURL = "";
    }

    const splitMatch = matchURL.split("/");

    if (selectedTab !== splitMatch[0]) {
      setBucketDetailsTab(splitMatch[0]);
    }
  }, [match, bucketName, setBucketDetailsTab, selectedTab]);

  // check the permissions for creating bucket
  useEffect(() => {
    if (loadingPerms) {
      api
        .invoke("POST", `/api/v1/has-permission`, {
          actions: [
            {
              id: "GetReplicationConfiguration",
              action: "s3:GetReplicationConfiguration",
              bucket_name: bucketName,
            },
          ],
        })
        .then((res: HasPermissionResponse) => {
          setLoadingPerms(false);
          if (!res.permissions) {
            return;
          }
          const actions = res.permissions ? res.permissions : [];

          let canGetReplicationVal = actions.find(
            (s) => s.id === "GetReplicationConfiguration"
          );

          if (canGetReplicationVal && canGetReplicationVal.can) {
            setCanGetReplication(true);
          } else {
            setCanGetReplication(false);
          }

          setLoadingPerms(false);
        })
        .catch((err: any) => {
          setLoadingPerms(false);
          setErrorSnackMessage(err);
        });
    }
  }, [bucketName, loadingPerms, setErrorSnackMessage]);

  const changeRoute = (newTab: string) => {
    let mainRoute = `/buckets/${bucketName}`;

    switch (newTab) {
      case "events":
        mainRoute += "/events";
        break;
      case "replication":
        mainRoute += "/replication";
        break;
      case "lifecycle":
        mainRoute += "/lifecycle";
        break;
      case "access":
        mainRoute += "/access";
        break;
      default:
        mainRoute += "/summary";
    }

    setBucketDetailsTab(newTab);
    history.push(mainRoute);
  };

  return (
    <Fragment>
      <PageHeader label={`Bucket > ${match.params["bucketName"]}`} />
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <Tabs
            value={selectedTab !== "" ? selectedTab : "summary"}
            onChange={(e: React.ChangeEvent<{}>, newValue: string) => {
              changeRoute(newValue);
            }}
            indicatorColor="primary"
            textColor="primary"
            aria-label="cluster-tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value="summary" label="Summary" {...a11yProps(0)} />
            <Tab value="events" label="Events" {...a11yProps(1)} />
            <Tab
              value="replication"
              label="Replication"
              {...a11yProps(2)}
              disabled={!canGetReplication}
            />
            <Tab value="lifecycle" label="Lifecycle" {...a11yProps(3)} />
            <Tab value="access" label="Access" {...a11yProps(4)} />
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} className={classes.routerContainer}>
            <Router history={history}>
              <Switch>
                <Route
                  path="/buckets/:bucketName/summary"
                  component={BucketSummaryPanel}
                />
                <Route
                  path="/buckets/:bucketName/events"
                  component={BucketEventsPanel}
                />
                <Route
                  path="/buckets/:bucketName/replication"
                  component={BucketReplicationPanel}
                />
                <Route
                  path="/buckets/:bucketName/lifecycle"
                  component={BucketLifecyclePanel}
                />
                <Route
                  path="/buckets/:bucketName/access"
                  component={AccessDetailsPanel}
                />
                <Route
                  path="/buckets/:bucketName/access"
                  component={AccessDetailsPanel}
                />
                <Route
                  path="/buckets/:bucketName"
                  component={() => (
                    <Redirect to={`/buckets/${bucketName}/summary`} />
                  )}
                />
              </Switch>
            </Router>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  session: state.console.session,
  selectedTab: state.buckets.bucketDetails.selectedTab,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
  setBucketDetailsTab,
});

export default withStyles(styles)(connector(BucketDetails));
