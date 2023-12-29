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
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  BackLink,
  Box,
  BucketsIcon,
  Button,
  FolderIcon,
  PageLayout,
  RefreshIcon,
  ScreenTitle,
  Tabs,
  TrashIcon,
} from "mds";
import { useSelector } from "react-redux";
import {
  browseBucketPermissions,
  deleteBucketPermissions,
  IAM_PERMISSIONS,
  IAM_ROLES,
  IAM_SCOPES,
  permissionTooltipHelper,
} from "../../../../common/SecureComponent/permissions";

import {
  hasPermission,
  SecureComponent,
} from "../../../../common/SecureComponent";

import withSuspense from "../../Common/Components/withSuspense";
import {
  selDistSet,
  selSiteRep,
  setErrorSnackMessage,
  setHelpName,
} from "../../../../systemSlice";
import {
  selBucketDetailsInfo,
  selBucketDetailsLoading,
  setBucketDetailsLoad,
  setBucketInfo,
} from "./bucketDetailsSlice";
import { useAppDispatch } from "../../../../store";
import TooltipWrapper from "../../Common/TooltipWrapper/TooltipWrapper";
import PageHeaderWrapper from "../../Common/PageHeaderWrapper/PageHeaderWrapper";
import { api } from "api";
import { errorToHandler } from "api/errors";
import HelpMenu from "../../HelpMenu";

const DeleteBucket = withSuspense(
  React.lazy(() => import("../ListBuckets/DeleteBucket")),
);
const AccessRulePanel = withSuspense(
  React.lazy(() => import("./AccessRulePanel")),
);
const AccessDetailsPanel = withSuspense(
  React.lazy(() => import("./AccessDetailsPanel")),
);
const BucketSummaryPanel = withSuspense(
  React.lazy(() => import("./BucketSummaryPanel")),
);
const BucketEventsPanel = withSuspense(
  React.lazy(() => import("./BucketEventsPanel")),
);
const BucketReplicationPanel = withSuspense(
  React.lazy(() => import("./BucketReplicationPanel")),
);
const BucketLifecyclePanel = withSuspense(
  React.lazy(() => import("./BucketLifecyclePanel")),
);

const BucketDetails = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const distributedSetup = useSelector(selDistSet);
  const loadingBucket = useSelector(selBucketDetailsLoading);
  const bucketInfo = useSelector(selBucketDetailsInfo);
  const siteReplicationInfo = useSelector(selSiteRep);

  const [iniLoad, setIniLoad] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const bucketName = params.bucketName || "";

  const canDelete = hasPermission(bucketName, deleteBucketPermissions);
  const canBrowse = hasPermission(bucketName, browseBucketPermissions);

  useEffect(() => {
    dispatch(setHelpName("bucket_details"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!iniLoad) {
      dispatch(setBucketDetailsLoad(true));
      setIniLoad(true);
    }
  }, [iniLoad, dispatch, setIniLoad]);

  useEffect(() => {
    if (loadingBucket) {
      api.buckets
        .bucketInfo(bucketName)
        .then((res) => {
          dispatch(setBucketDetailsLoad(false));
          dispatch(setBucketInfo(res.data));
        })
        .catch((err) => {
          dispatch(setBucketDetailsLoad(false));
          dispatch(setErrorSnackMessage(errorToHandler(err)));
        });
    }
  }, [bucketName, loadingBucket, dispatch]);

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
      navigate("/buckets");
    }
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
      <PageHeaderWrapper
        label={
          <BackLink label={"Buckets"} onClick={() => navigate("/buckets")} />
        }
        actions={
          <Fragment>
            <TooltipWrapper
              tooltip={
                canBrowse
                  ? "Browse Bucket"
                  : permissionTooltipHelper(
                      IAM_PERMISSIONS[IAM_ROLES.BUCKET_VIEWER],
                      "browsing this bucket",
                    )
              }
            >
              <Button
                id={"switch-browse-view"}
                aria-label="Browse Bucket"
                onClick={() => {
                  navigate(`/browser/${bucketName}`);
                }}
                icon={
                  <FolderIcon
                    style={{ width: 20, height: 20, marginTop: -3 }}
                  />
                }
                style={{
                  padding: "0 10px",
                }}
                disabled={!canBrowse}
              />
            </TooltipWrapper>
            <HelpMenu />
          </Fragment>
        }
      />
      <PageLayout>
        <ScreenTitle
          icon={
            <Fragment>
              <BucketsIcon width={40} />
            </Fragment>
          }
          title={bucketName}
          subTitle={
            <SecureComponent
              scopes={[
                IAM_SCOPES.S3_GET_BUCKET_POLICY,
                IAM_SCOPES.S3_GET_ACTIONS,
              ]}
              resource={bucketName}
            >
              <span style={{ fontSize: 15 }}>Access: </span>
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  textTransform: "capitalize",
                }}
              >
                {bucketInfo?.access?.toLowerCase()}
              </span>
            </SecureComponent>
          }
          actions={
            <Fragment>
              <SecureComponent
                scopes={deleteBucketPermissions}
                resource={bucketName}
                errorProps={{ disabled: true }}
              >
                <TooltipWrapper
                  tooltip={
                    canDelete
                      ? ""
                      : permissionTooltipHelper(
                          [
                            IAM_SCOPES.S3_DELETE_BUCKET,
                            IAM_SCOPES.S3_FORCE_DELETE_BUCKET,
                          ],
                          "deleting this bucket",
                        )
                  }
                >
                  <Button
                    id={"delete-bucket-button"}
                    onClick={() => {
                      setDeleteOpen(true);
                    }}
                    label={"Delete Bucket"}
                    icon={<TrashIcon />}
                    variant={"secondary"}
                    disabled={!canDelete}
                  />
                </TooltipWrapper>
              </SecureComponent>
              <Button
                id={"refresh-bucket-info"}
                onClick={() => {
                  dispatch(setBucketDetailsLoad(true));
                }}
                label={"Refresh"}
                icon={<RefreshIcon />}
              />
            </Fragment>
          }
          sx={{ marginBottom: 15 }}
        />
        <Box>
          <Tabs
            currentTabOrPath={location.pathname}
            useRouteTabs
            onTabClick={(tab) => {
              navigate(tab);
            }}
            options={[
              {
                tabConfig: {
                  label: "Summary",
                  id: "summary",
                  to: getRoutePath("summary"),
                },
              },
              {
                tabConfig: {
                  label: "Events",
                  id: "events",
                  disabled: !hasPermission(bucketName, [
                    IAM_SCOPES.S3_GET_BUCKET_NOTIFICATIONS,
                    IAM_SCOPES.S3_PUT_BUCKET_NOTIFICATIONS,
                    IAM_SCOPES.S3_GET_ACTIONS,
                    IAM_SCOPES.S3_PUT_ACTIONS,
                  ]),
                  to: getRoutePath("events"),
                },
              },
              {
                tabConfig: {
                  label: "Replication",
                  id: "replication",
                  disabled:
                    !distributedSetup ||
                    (siteReplicationInfo.enabled &&
                      siteReplicationInfo.curSite) ||
                    !hasPermission(bucketName, [
                      IAM_SCOPES.S3_GET_REPLICATION_CONFIGURATION,
                      IAM_SCOPES.S3_PUT_REPLICATION_CONFIGURATION,
                      IAM_SCOPES.S3_GET_ACTIONS,
                      IAM_SCOPES.S3_PUT_ACTIONS,
                    ]),
                  to: getRoutePath("replication"),
                },
              },
              {
                tabConfig: {
                  label: "Lifecycle",
                  id: "lifecycle",
                  disabled:
                    !distributedSetup ||
                    !hasPermission(bucketName, [
                      IAM_SCOPES.S3_GET_LIFECYCLE_CONFIGURATION,
                      IAM_SCOPES.S3_PUT_LIFECYCLE_CONFIGURATION,
                      IAM_SCOPES.S3_GET_ACTIONS,
                      IAM_SCOPES.S3_PUT_ACTIONS,
                    ]),
                  to: getRoutePath("lifecycle"),
                },
              },
              {
                tabConfig: {
                  label: "Access",
                  id: "access",
                  disabled: !hasPermission(bucketName, [
                    IAM_SCOPES.ADMIN_GET_POLICY,
                    IAM_SCOPES.ADMIN_LIST_USER_POLICIES,
                    IAM_SCOPES.ADMIN_LIST_USERS,
                  ]),
                  to: getRoutePath("access"),
                },
              },
              {
                tabConfig: {
                  label: "Anonymous",
                  id: "anonymous",
                  disabled: !hasPermission(bucketName, [
                    IAM_SCOPES.S3_GET_BUCKET_POLICY,
                    IAM_SCOPES.S3_GET_ACTIONS,
                  ]),
                  to: getRoutePath("prefix"),
                },
              },
            ]}
            routes={
              <Routes>
                <Route path="summary" element={<BucketSummaryPanel />} />
                <Route path="events" element={<BucketEventsPanel />} />
                {distributedSetup && (
                  <Route
                    path="replication"
                    element={<BucketReplicationPanel />}
                  />
                )}
                {distributedSetup && (
                  <Route path="lifecycle" element={<BucketLifecyclePanel />} />
                )}

                <Route path="access" element={<AccessDetailsPanel />} />
                <Route path="prefix" element={<AccessRulePanel />} />
                <Route
                  path="*"
                  element={
                    <Navigate to={`/buckets/${bucketName}/admin/summary`} />
                  }
                />
              </Routes>
            }
          />
        </Box>
      </PageLayout>
    </Fragment>
  );
};

export default BucketDetails;
