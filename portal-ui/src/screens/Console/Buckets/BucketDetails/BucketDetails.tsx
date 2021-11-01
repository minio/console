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
import { Link, Redirect, Route, Router, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Grid from "@mui/material/Grid";
import api from "../../../../common/api";
import { BucketInfo, HasPermissionResponse } from "../types";
import {
  actionsTray,
  buttonsStyles,
  containerForHeader,
  hrClass,
  searchField,
} from "../../Common/FormComponents/common/styleLibrary";
import { setErrorSnackMessage } from "../../../../actions";
import {
  setBucketDetailsLoad,
  setBucketDetailsTab,
  setBucketInfo,
} from "../actions";
import { AppState } from "../../../../store";
import { ErrorResponseHandler } from "../../../../common/types";
import PageHeader from "../../Common/PageHeader/PageHeader";
import AccessDetailsPanel from "./AccessDetailsPanel";
import BucketSummaryPanel from "./BucketSummaryPanel";
import BucketEventsPanel from "./BucketEventsPanel";
import BucketReplicationPanel from "./BucketReplicationPanel";
import BucketLifecyclePanel from "./BucketLifecyclePanel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ScreenTitle from "../../Common/ScreenTitle/ScreenTitle";
import { IconButton, Tooltip } from "@mui/material";
import { BucketsIcon, DeleteIcon, FolderIcon } from "../../../../icons";
import DeleteBucket from "../ListBuckets/DeleteBucket";
import AccessRulePanel from "./AccessRulePanel";
import RefreshIcon from "../../../../icons/RefreshIcon";
import BoxIconButton from "../../Common/BoxIconButton";

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
      "& .MuiSvgIcon-root": {
        width: 16,
        height: 16,
      },
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

    breadcrumLink: {
      textDecoration: "none",
      color: "black",
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
  selectedTab: string;
  distributedSetup: boolean;
  setErrorSnackMessage: typeof setErrorSnackMessage;
  setBucketDetailsTab: typeof setBucketDetailsTab;
  setBucketDetailsLoad: typeof setBucketDetailsLoad;
  loadingBucket: boolean;
  setBucketInfo: typeof setBucketInfo;
  bucketInfo: BucketInfo | null;
}

const BucketDetails = ({
  classes,
  match,
  history,
  selectedTab,
  setErrorSnackMessage,
  setBucketDetailsTab,
  distributedSetup,
  setBucketDetailsLoad,
  loadingBucket,
  setBucketInfo,
  bucketInfo,
}: IBucketDetailsProps) => {
  const [iniLoad, setIniLoad] = useState<boolean>(false);
  const [loadingPerms, setLoadingPerms] = useState<boolean>(true);
  const [canGetReplication, setCanGetReplication] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const bucketName = match.params["bucketName"];

  useEffect(() => {
    if (!iniLoad) {
      setBucketDetailsLoad(true);
      setIniLoad(true);
    }
  }, [iniLoad, setBucketDetailsLoad, setIniLoad]);

  useEffect(() => {
    if (loadingBucket) {
      api
        .invoke("GET", `/api/v1/buckets/${bucketName}`)
        .then((res: BucketInfo) => {
          setBucketDetailsLoad(false);
          setBucketInfo(res);
        })
        .catch((err: ErrorResponseHandler) => {
          setBucketDetailsLoad(false);
          setErrorSnackMessage(err);
        });
    }
  }, [
    bucketName,
    loadingBucket,
    setBucketDetailsLoad,
    setBucketInfo,
    setErrorSnackMessage,
  ]);

  useEffect(() => {
    let matchURL = match.params ? match.params["0"] : "browse";

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
        .catch((err: ErrorResponseHandler) => {
          setLoadingPerms(false);
          setErrorSnackMessage(err);
        });
    }
  }, [bucketName, loadingPerms, setErrorSnackMessage]);

  const changeRoute = (newTab: string) => {
    let mainRoute = `/buckets/${bucketName}`;

    switch (newTab) {
      case "events":
        mainRoute += "/admin/events";
        break;
      case "replication":
        mainRoute += "/admin/replication";
        break;
      case "lifecycle":
        mainRoute += "/admin/lifecycle";
        break;
      case "access":
        mainRoute += "/admin/access";
        break;
      case "prefix":
        mainRoute += "/admin/prefix";
        break;
      default:
        mainRoute += "/admin/summary";
    }

    setBucketDetailsTab(newTab);
    history.push(mainRoute);
  };

  const closeDeleteModalAndRefresh = (refresh: boolean) => {
    setDeleteOpen(false);
    if (refresh) {
      history.push("/buckets");
    }
  };

  const openBucketBrowser = () => {
    history.push(`/buckets/${bucketName}/browse`);
  };

  return (
    <Fragment>
      {deleteOpen && (
        <DeleteBucket
          deleteOpen={deleteOpen}
          selectedBucket={bucketName}
          closeDeleteModalAndRefresh={(refresh: boolean) => {
            closeDeleteModalAndRefresh(refresh);
          }}
        />
      )}
      <PageHeader
        label={
          <Fragment>
            <Link to={"/buckets"} className={classes.breadcrumLink}>
              Buckets
            </Link>
          </Fragment>
        }
        actions={
          <Fragment>
            <Tooltip title={"Browse Bucket"}>
              <IconButton
                color="primary"
                aria-label="Browse Bucket"
                component="span"
                onClick={openBucketBrowser}
                size="large"
              >
                <FolderIcon />
              </IconButton>
            </Tooltip>
          </Fragment>
        }
      />
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <BucketsIcon width={40} />
              </Fragment>
            }
            title={bucketName}
            subTitle={
              <Fragment>
                Access:{" "}
                {bucketInfo &&
                  bucketInfo?.access[0].toUpperCase() +
                    bucketInfo?.access.substr(1).toLowerCase()}
              </Fragment>
            }
            actions={
              <Fragment>
                <Tooltip title={"Delete"}>
                  <BoxIconButton
                    color="primary"
                    aria-label="Delete"
                    onClick={() => {
                      setDeleteOpen(true);
                    }}
                    size="large"
                  >
                    <DeleteIcon />
                  </BoxIconButton>
                </Tooltip>
                <Tooltip title={"Refresh"}>
                  <BoxIconButton
                    color="primary"
                    aria-label="Refresh List"
                    onClick={() => {
                      setBucketDetailsLoad(true);
                    }}
                    size="large"
                  >
                    <RefreshIcon />
                  </BoxIconButton>
                </Tooltip>
              </Fragment>
            }
          />
        </Grid>
        <Grid item xs={2}>
          <List component="nav" dense={true}>
            <ListItem
              button
              selected={selectedTab === "summary"}
              onClick={() => {
                changeRoute("summary");
              }}
            >
              <ListItemText primary="Summary" />
            </ListItem>
            <ListItem
              button
              selected={selectedTab === "events"}
              onClick={() => {
                changeRoute("events");
              }}
            >
              <ListItemText primary="Events" />
            </ListItem>
            <ListItem
              button
              disabled={!canGetReplication}
              selected={selectedTab === "replication"}
              onClick={() => {
                changeRoute("replication");
              }}
            >
              <ListItemText primary="Replication" />
            </ListItem>

            <ListItem
              button
              selected={selectedTab === "lifecycle"}
              onClick={() => {
                changeRoute("lifecycle");
              }}
            >
              <ListItemText primary="Lifecycle" />
            </ListItem>
            <ListItem
              button
              selected={selectedTab === "access"}
              onClick={() => {
                changeRoute("access");
              }}
            >
              <ListItemText primary="Access Audit" />
            </ListItem>
            <ListItem
              button
              selected={selectedTab === "prefix"}
              onClick={() => {
                changeRoute("prefix");
              }}
            >
              <ListItemText primary="Access Rules" />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={10}>
          <Router history={history}>
            <Switch>
              <Route
                path="/buckets/:bucketName/admin/summary"
                component={BucketSummaryPanel}
              />
              <Route
                path="/buckets/:bucketName/admin/events"
                component={BucketEventsPanel}
              />
              {distributedSetup && (
                <Route
                  path="/buckets/:bucketName/admin/replication"
                  component={BucketReplicationPanel}
                />
              )}
              {distributedSetup && (
                <Route
                  path="/buckets/:bucketName/admin/lifecycle"
                  component={BucketLifecyclePanel}
                />
              )}

              <Route
                path="/buckets/:bucketName/admin/access"
                component={AccessDetailsPanel}
              />
              <Route
                path="/buckets/:bucketName/admin/prefix"
                component={AccessRulePanel}
              />
              <Route
                path="/buckets/:bucketName"
                component={() => (
                  <Redirect to={`/buckets/${bucketName}/admin/summary`} />
                )}
              />
            </Switch>
          </Router>
        </Grid>
      </Grid>
    </Fragment>
  );
};

const mapState = (state: AppState) => ({
  session: state.console.session,
  selectedTab: state.buckets.bucketDetails.selectedTab,
  distributedSetup: state.system.distributedSetup,
  loadingBucket: state.buckets.bucketDetails.loadingBucket,
  bucketInfo: state.buckets.bucketDetails.bucketInfo,
});

const connector = connect(mapState, {
  setErrorSnackMessage,
  setBucketDetailsTab,
  setBucketDetailsLoad,
  setBucketInfo,
});

export default withStyles(styles)(connector(BucketDetails));
