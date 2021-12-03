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
import { BucketInfo } from "../types";
import {
  buttonsStyles,
  containerForHeader,
  hrClass,
  pageContentStyles,
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

import ScreenTitle from "../../Common/ScreenTitle/ScreenTitle";
import { IconButton, Tooltip } from "@mui/material";

import RefreshIcon from "../../../../icons/RefreshIcon";
import BoxIconButton from "../../Common/BoxIconButton/BoxIconButton";
import { IAM_SCOPES } from "../../../../common/SecureComponent/permissions";
import PageLayout from "../../Common/Layout/PageLayout";
import VerticalTabs from "../../Common/VerticalTabs/VerticalTabs";
import BackLink from "../../../../common/BackLink";
import SecureComponent, {
  hasPermission,
} from "../../../../common/SecureComponent/SecureComponent";

import withSuspense from "../../Common/Components/withSuspense";

const BucketsIcon = React.lazy(() => import("../../../../icons/BucketsIcon"));
const DeleteIcon = React.lazy(() => import("../../../../icons/DeleteIcon"));
const FolderIcon = React.lazy(() => import("../../../../icons/FolderIcon"));

const DeleteBucket = withSuspense(
  React.lazy(() => import("../ListBuckets/DeleteBucket"))
);
const AccessRulePanel = withSuspense(
  React.lazy(() => import("./AccessRulePanel"))
);
const AccessDetailsPanel = withSuspense(
  React.lazy(() => import("./AccessDetailsPanel"))
);
const BucketSummaryPanel = withSuspense(
  React.lazy(() => import("./BucketSummaryPanel"))
);
const BucketEventsPanel = withSuspense(
  React.lazy(() => import("./BucketEventsPanel"))
);
const BucketReplicationPanel = withSuspense(
  React.lazy(() => import("./BucketReplicationPanel"))
);
const BucketLifecyclePanel = withSuspense(
  React.lazy(() => import("./BucketLifecyclePanel"))
);

const styles = (theme: Theme) =>
  createStyles({
    pageContainer: {
      border: "1px solid #EAEAEA",
      height: "100%",
    },
    ...pageContentStyles,
    breadcrumLink: {
      textDecoration: "none",
      color: "black",
    },
    ...searchField,
    capitalize: {
      textTransform: "capitalize",
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
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const bucketName = match.params["bucketName"];

  let selTab = match?.params["0"];
  selTab = selTab ? selTab : "summary";

  const [activeTab, setActiveTab] = useState(selTab);

  useEffect(() => {
    setActiveTab(selTab);
  }, [selTab]);

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

  let topLevelRoute = `/buckets/${bucketName}`;
  const defaultRoute = "/admin/summary";

  const manageBucketRoutes: Record<string, any> = {
    events: "/admin/events",
    replication: "/admin/replication",
    lifecycle: "/admin/lifecycle",
    access: "/admin/access",
    prefix: "/admin/prefix",
  };

  const getRoutePath = (routeKey: string) => {
    let path = manageBucketRoutes[routeKey];
    if (!path) {
      path = `${topLevelRoute}${defaultRoute}`;
    } else {
      path = `${topLevelRoute}${path}`;
    }
    return path;
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
      <BackLink to={"/buckets"} label={"Back to Buckets"} />
      <PageLayout className={classes.pageContainer}>
        <Grid item xs={12}>
          <ScreenTitle
            icon={
              <Fragment>
                <BucketsIcon width={40} />
              </Fragment>
            }
            title={bucketName}
            subTitle={
              <SecureComponent
                scopes={[IAM_SCOPES.S3_GET_BUCKET_POLICY]}
                resource={bucketName}
              >
                Access:{" "}
                <span className={classes.capitalize}>
                  {bucketInfo?.access.toLowerCase()}
                </span>
              </SecureComponent>
            }
            actions={
              <Fragment>
                <SecureComponent
                  scopes={[
                    IAM_SCOPES.S3_DELETE_BUCKET,
                    IAM_SCOPES.S3_FORCE_DELETE_BUCKET,
                  ]}
                  resource={bucketName}
                  errorProps={{ disabled: true }}
                >
                  <BoxIconButton
                    tooltip={"Delete"}
                    color="primary"
                    aria-label="Delete"
                    onClick={() => {
                      setDeleteOpen(true);
                    }}
                    size="large"
                  >
                    <DeleteIcon />
                  </BoxIconButton>
                </SecureComponent>
                <BoxIconButton
                  tooltip={"Refresh"}
                  color="primary"
                  aria-label="Refresh List"
                  onClick={() => {
                    setBucketDetailsLoad(true);
                  }}
                  size="large"
                  variant={"contained"}
                >
                  <RefreshIcon />
                </BoxIconButton>
              </Fragment>
            }
          />
        </Grid>
        <VerticalTabs
          selectedTab={activeTab}
          isRouteTabs
          routes={
            <div className={classes.contentSpacer}>
              <Router history={history}>
                <Switch>
                  <Route
                    exact
                    path="/buckets/:bucketName/admin/summary"
                    component={BucketSummaryPanel}
                  />
                  <Route
                    exact
                    path="/buckets/:bucketName/admin/events"
                    component={BucketEventsPanel}
                  />
                  {distributedSetup && (
                    <Route
                      exact
                      path="/buckets/:bucketName/admin/replication"
                      component={BucketReplicationPanel}
                    />
                  )}
                  {distributedSetup && (
                    <Route
                      exact
                      path="/buckets/:bucketName/admin/lifecycle"
                      component={BucketLifecyclePanel}
                    />
                  )}

                  <Route
                    exact
                    path="/buckets/:bucketName/admin/access"
                    component={AccessDetailsPanel}
                  />
                  <Route
                    exact
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
            </div>
          }
        >
          {{
            tabConfig: {
              label: "Summary",
              value: "summary",
              component: Link,
              to: getRoutePath("summary"),
            },
          }}
          {{
            tabConfig: {
              label: "Events",
              value: "events",
              component: Link,
              disabled: !hasPermission(bucketName, [
                IAM_SCOPES.S3_GET_BUCKET_NOTIFICATIONS,
                IAM_SCOPES.S3_PUT_BUCKET_NOTIFICATIONS,
              ]),
              to: getRoutePath("events"),
            },
          }}
          {{
            tabConfig: {
              label: "Replication",
              value: "replication",
              component: Link,
              disabled:
                !distributedSetup ||
                !hasPermission(bucketName, [
                  IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION,
                  IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
                ]),
              to: getRoutePath("replication"),
            },
          }}
          {{
            tabConfig: {
              label: "Lifecycle",
              value: "lifecycle",
              component: Link,
              disabled:
                !distributedSetup ||
                !hasPermission(bucketName, [
                  IAM_SCOPES.S3_GET_LIFECYCLE_CONFIGURATION,
                  IAM_SCOPES.S3_PUT_LIFECYCLE_CONFIGURATION,
                ]),
              to: getRoutePath("lifecycle"),
            },
          }}
          {{
            tabConfig: {
              label: "Access Audit",
              value: "access",
              component: Link,
              disabled: !hasPermission(bucketName, [
                IAM_SCOPES.ADMIN_GET_POLICY,
                IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
                IAM_SCOPES.ADMIN_LIST_USERS,
              ]),
              to: getRoutePath("access"),
            },
          }}
          {{
            tabConfig: {
              label: "Access Rules",
              value: "prefix",
              component: Link,
              disabled: !hasPermission(bucketName, [
                IAM_SCOPES.S3_GET_BUCKET_POLICY,
              ]),
              to: getRoutePath("prefix"),
            },
          }}
        </VerticalTabs>
      </PageLayout>
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
