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

import React, {
  Fragment,
  Suspense,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Box, Button, MainContainer, ProgressBar, Snackbar } from "mds";
import debounce from "lodash/debounce";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selFeatures, selSession } from "./consoleSlice";
import { api } from "api";
import { AppState, useAppDispatch } from "../../store";
import MainError from "./Common/MainError/MainError";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PAGES_PERMISSIONS,
  IAM_SCOPES,
  S3_ALL_RESOURCES,
} from "../../common/SecureComponent/permissions";
import { hasPermission } from "../../common/SecureComponent";
import { IRouteRule } from "./Menu/types";
import {
  menuOpen,
  selDistSet,
  serverIsLoading,
  setServerNeedsRestart,
  setSnackBarMessage,
} from "../../systemSlice";
import MenuWrapper from "./Menu/MenuWrapper";
import LoadingComponent from "../../common/LoadingComponent";
import ComponentsScreen from "./Common/ComponentsScreen";

const Trace = React.lazy(() => import("./Trace/Trace"));
const Watch = React.lazy(() => import("./Watch/Watch"));
const HealthInfo = React.lazy(() => import("./HealthInfo/HealthInfo"));

const EventDestinations = React.lazy(
  () => import("./EventDestinations/EventDestinations"),
);
const AddEventDestination = React.lazy(
  () => import("./EventDestinations/AddEventDestination"),
);
const EventTypeSelector = React.lazy(
  () => import("./EventDestinations/EventTypeSelector"),
);

const ListTiersConfiguration = React.lazy(
  () => import("./Configurations/TiersConfiguration/ListTiersConfiguration"),
);
const TierTypeSelector = React.lazy(
  () => import("./Configurations/TiersConfiguration/TierTypeSelector"),
);
const AddTierConfiguration = React.lazy(
  () => import("./Configurations/TiersConfiguration/AddTierConfiguration"),
);

const ErrorLogs = React.lazy(() => import("./Logs/ErrorLogs/ErrorLogs"));
const LogsSearchMain = React.lazy(
  () => import("./Logs/LogSearch/LogsSearchMain"),
);
const GroupsDetails = React.lazy(() => import("./Groups/GroupsDetails"));

const Tools = React.lazy(() => import("./Tools/Tools"));
const IconsScreen = React.lazy(() => import("./Common/IconsScreen"));

const Speedtest = React.lazy(() => import("./Speedtest/Speedtest"));

const ObjectManager = React.lazy(
  () => import("./Common/ObjectManager/ObjectManager"),
);

const ObjectBrowser = React.lazy(() => import("./ObjectBrowser/ObjectBrowser"));

const Buckets = React.lazy(() => import("./Buckets/Buckets"));

const EditBucketReplication = React.lazy(
  () => import("./Buckets/BucketDetails/EditBucketReplication"),
);
const AddBucketReplication = React.lazy(
  () => import("./Buckets/BucketDetails/AddBucketReplication"),
);
const Policies = React.lazy(() => import("./Policies/Policies"));

const AddPolicyScreen = React.lazy(() => import("./Policies/AddPolicyScreen"));
const Dashboard = React.lazy(() => import("./Dashboard/Dashboard"));

const Account = React.lazy(() => import("./Account/Account"));

const AccountCreate = React.lazy(
  () => import("./Account/AddServiceAccountScreen"),
);

const Users = React.lazy(() => import("./Users/Users"));
const Groups = React.lazy(() => import("./Groups/Groups"));
const IDPOpenIDConfigurations = React.lazy(
  () => import("./IDP/IDPOpenIDConfigurations"),
);
const AddIDPOpenIDConfiguration = React.lazy(
  () => import("./IDP/AddIDPOpenIDConfiguration"),
);
const IDPLDAPConfigurationDetails = React.lazy(
  () => import("./IDP/LDAP/IDPLDAPConfigurationDetails"),
);
const IDPOpenIDConfigurationDetails = React.lazy(
  () => import("./IDP/IDPOpenIDConfigurationDetails"),
);

const License = React.lazy(() => import("./License/License"));
const ConfigurationOptions = React.lazy(
  () => import("./Configurations/ConfigurationPanels/ConfigurationOptions"),
);

const AddGroupScreen = React.lazy(() => import("./Groups/AddGroupScreen"));
const SiteReplication = React.lazy(
  () => import("./Configurations/SiteReplication/SiteReplication"),
);
const SiteReplicationStatus = React.lazy(
  () => import("./Configurations/SiteReplication/SiteReplicationStatus"),
);

const AddReplicationSites = React.lazy(
  () => import("./Configurations/SiteReplication/AddReplicationSites"),
);

const KMSRoutes = React.lazy(() => import("./KMS/KMSRoutes"));

const Console = () => {
  const dispatch = useAppDispatch();
  const { pathname = "" } = useLocation();
  const open = useSelector((state: AppState) => state.system.sidebarOpen);
  const session = useSelector(selSession);
  const features = useSelector(selFeatures);
  const distributedSetup = useSelector(selDistSet);
  const snackBarMessage = useSelector(
    (state: AppState) => state.system.snackBar,
  );
  const needsRestart = useSelector(
    (state: AppState) => state.system.serverNeedsRestart,
  );
  const isServerLoading = useSelector(
    (state: AppState) => state.system.serverIsLoading,
  );
  const loadingProgress = useSelector(
    (state: AppState) => state.system.loadingProgress,
  );

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const ldapIsEnabled = (features && features.includes("ldap-idp")) || false;
  const kmsIsEnabled = (features && features.includes("kms")) || false;
  const obOnly = !!features?.includes("object-browser-only");

  useEffect(() => {
    dispatch({ type: "socket/OBConnect" });
  }, [dispatch]);

  const restartServer = () => {
    dispatch(serverIsLoading(true));
    api.service
      .restartService({})
      .then(() => {
        console.log("success restarting service");
        dispatch(serverIsLoading(false));
        dispatch(setServerNeedsRestart(false));
      })
      .catch((err) => {
        if (err.error.errorMessage === "Error 502") {
          dispatch(setServerNeedsRestart(false));
        }
        dispatch(serverIsLoading(false));
        console.log("failure restarting service");
        console.error(err.error);
      });
  };

  // Layout effect to be executed after last re-render for resizing only
  useLayoutEffect(() => {
    // Debounce to not execute constantly
    const debounceSize = debounce(() => {
      if (open && window.innerWidth <= 1024) {
        dispatch(menuOpen(false));
      }
    }, 300);

    // Added event listener for window resize
    window.addEventListener("resize", debounceSize);

    // We remove the listener on component unmount
    return () => window.removeEventListener("resize", debounceSize);
  });

  const consoleAdminRoutes: IRouteRule[] = [
    {
      component: ObjectBrowser,
      path: IAM_PAGES.OBJECT_BROWSER_VIEW,
      forceDisplay: true,
      customPermissionFnc: () => {
        const path = window.location.pathname;
        const resource = path.match(/browser\/(.*)\//);
        return (
          resource &&
          resource.length > 0 &&
          hasPermission(
            resource[1],
            IAM_PAGES_PERMISSIONS[IAM_PAGES.OBJECT_BROWSER_VIEW],
          )
        );
      },
    },
    {
      component: Buckets,
      path: IAM_PAGES.BUCKETS,
      forceDisplay: true,
    },
    {
      component: Dashboard,
      path: IAM_PAGES.DASHBOARD,
    },
    {
      component: Buckets,
      path: IAM_PAGES.ADD_BUCKETS,
      customPermissionFnc: () => {
        return hasPermission("*", IAM_PAGES_PERMISSIONS[IAM_PAGES.ADD_BUCKETS]);
      },
    },
    {
      component: AddBucketReplication,
      path: IAM_PAGES.BUCKETS_ADD_REPLICATION,
      customPermissionFnc: () => {
        return hasPermission(
          "*",
          IAM_PAGES_PERMISSIONS[IAM_PAGES.BUCKETS_ADD_REPLICATION],
        );
      },
    },
    {
      component: EditBucketReplication,
      path: IAM_PAGES.BUCKETS_EDIT_REPLICATION,
      customPermissionFnc: () => {
        return hasPermission(
          "*",
          IAM_PAGES_PERMISSIONS[IAM_PAGES.BUCKETS_EDIT_REPLICATION],
        );
      },
    },
    {
      component: Buckets,
      path: IAM_PAGES.BUCKETS_ADMIN_VIEW,
      customPermissionFnc: () => {
        const path = window.location.pathname;
        const resource = path.match(/buckets\/(.*)\/admin*/);
        return (
          resource &&
          resource.length > 0 &&
          hasPermission(
            resource[1],
            IAM_PAGES_PERMISSIONS[IAM_PAGES.BUCKETS_ADMIN_VIEW],
          )
        );
      },
    },

    {
      component: Watch,
      path: IAM_PAGES.TOOLS_WATCH,
    },
    {
      component: Speedtest,
      path: IAM_PAGES.TOOLS_SPEEDTEST,
    },
    {
      component: Users,
      path: IAM_PAGES.USERS,
      fsHidden: ldapIsEnabled,
      customPermissionFnc: () =>
        hasPermission(CONSOLE_UI_RESOURCE, [IAM_SCOPES.ADMIN_LIST_USERS]) ||
        hasPermission(S3_ALL_RESOURCES, [IAM_SCOPES.ADMIN_CREATE_USER]),
    },
    {
      component: Groups,
      path: IAM_PAGES.GROUPS,
      fsHidden: ldapIsEnabled,
    },
    {
      component: AddGroupScreen,
      path: IAM_PAGES.GROUPS_ADD,
    },
    {
      component: GroupsDetails,
      path: IAM_PAGES.GROUPS_VIEW,
    },
    {
      component: Policies,
      path: IAM_PAGES.POLICIES_VIEW,
    },
    {
      component: AddPolicyScreen,
      path: IAM_PAGES.POLICY_ADD,
    },
    {
      component: Policies,
      path: IAM_PAGES.POLICIES,
    },
    {
      component: IDPLDAPConfigurationDetails,
      path: IAM_PAGES.IDP_LDAP_CONFIGURATIONS,
    },
    {
      component: IDPOpenIDConfigurations,
      path: IAM_PAGES.IDP_OPENID_CONFIGURATIONS,
    },
    {
      component: AddIDPOpenIDConfiguration,
      path: IAM_PAGES.IDP_OPENID_CONFIGURATIONS_ADD,
    },
    {
      component: IDPOpenIDConfigurationDetails,
      path: IAM_PAGES.IDP_OPENID_CONFIGURATIONS_VIEW,
    },
    {
      component: Trace,
      path: IAM_PAGES.TOOLS_TRACE,
    },
    {
      component: HealthInfo,
      path: IAM_PAGES.TOOLS_DIAGNOSTICS,
    },
    {
      component: ErrorLogs,
      path: IAM_PAGES.TOOLS_LOGS,
    },
    {
      component: LogsSearchMain,
      path: IAM_PAGES.TOOLS_AUDITLOGS,
    },
    {
      component: Tools,
      path: IAM_PAGES.TOOLS,
    },
    {
      component: ConfigurationOptions,
      path: IAM_PAGES.SETTINGS,
    },
    {
      component: AddEventDestination,
      path: IAM_PAGES.EVENT_DESTINATIONS_ADD_SERVICE,
    },
    {
      component: EventTypeSelector,
      path: IAM_PAGES.EVENT_DESTINATIONS_ADD,
    },
    {
      component: EventDestinations,
      path: IAM_PAGES.EVENT_DESTINATIONS,
    },
    {
      component: AddTierConfiguration,
      path: IAM_PAGES.TIERS_ADD_SERVICE,
      fsHidden: !distributedSetup,
    },
    {
      component: TierTypeSelector,
      path: IAM_PAGES.TIERS_ADD,
      fsHidden: !distributedSetup,
    },
    {
      component: ListTiersConfiguration,
      path: IAM_PAGES.TIERS,
    },
    {
      component: SiteReplication,
      path: IAM_PAGES.SITE_REPLICATION,
    },
    {
      component: SiteReplicationStatus,
      path: IAM_PAGES.SITE_REPLICATION_STATUS,
    },
    {
      component: AddReplicationSites,
      path: IAM_PAGES.SITE_REPLICATION_ADD,
    },
    {
      component: Account,
      path: IAM_PAGES.ACCOUNT,
      forceDisplay: true,
      // user has implicit access to service-accounts
    },
    {
      component: AccountCreate,
      path: IAM_PAGES.ACCOUNT_ADD,
      forceDisplay: true, // user has implicit access to service-accounts
    },
    {
      component: License,
      path: IAM_PAGES.LICENSE,
      forceDisplay: true,
    },
    {
      component: KMSRoutes,
      path: IAM_PAGES.KMS,
      fsHidden: !kmsIsEnabled,
    },
  ];

  let routes = consoleAdminRoutes;

  const allowedRoutes = routes.filter((route: any) =>
    obOnly
      ? route.path.includes("browser")
      : (route.forceDisplay ||
          (route.customPermissionFnc
            ? route.customPermissionFnc()
            : hasPermission(
                CONSOLE_UI_RESOURCE,
                IAM_PAGES_PERMISSIONS[route.path],
              ))) &&
        !route.fsHidden,
  );

  const closeSnackBar = () => {
    setOpenSnackbar(false);
    dispatch(setSnackBarMessage(""));
  };

  useEffect(() => {
    if (snackBarMessage.message === "") {
      setOpenSnackbar(false);
      return;
    }
    // Open SnackBar
    if (snackBarMessage.type !== "error") {
      setOpenSnackbar(true);
    }
  }, [snackBarMessage]);

  let hideMenu = false;
  if (features?.includes("hide-menu") || pathname.endsWith("/hop") || obOnly) {
    hideMenu = true;
  }

  return (
    <Fragment>
      {session && session.status === "ok" ? (
        <MainContainer
          menu={!hideMenu ? <MenuWrapper /> : <Fragment />}
          mobileModeAuto={false}
        >
          <Fragment>
            {needsRestart && (
              <Snackbar
                onClose={() => {}}
                open={needsRestart}
                variant={"warning"}
                message={
                  <Box
                    sx={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    {isServerLoading ? (
                      <Fragment>
                        <ProgressBar
                          barHeight={3}
                          transparentBG
                          sx={{
                            width: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                          }}
                        />
                        <span>The server is restarting.</span>
                      </Fragment>
                    ) : (
                      <Fragment>
                        The instance needs to be restarted for configuration
                        changes to take effect.{" "}
                        <Button
                          id={"restart-server"}
                          variant="secondary"
                          onClick={() => {
                            restartServer();
                          }}
                          label={"Restart"}
                        />
                      </Fragment>
                    )}
                  </Box>
                }
                autoHideDuration={0}
              />
            )}
            {loadingProgress < 100 && (
              <ProgressBar
                barHeight={3}
                variant="determinate"
                value={loadingProgress}
                sx={{ width: "100%", position: "absolute", top: 0, left: 0 }}
              />
            )}
            <MainError />
            <Snackbar
              onClose={closeSnackBar}
              open={openSnackbar}
              message={snackBarMessage.message}
              variant={snackBarMessage.type === "error" ? "error" : "default"}
              autoHideDuration={snackBarMessage.type === "error" ? 10 : 5}
              condensed
            />
            <Suspense fallback={<LoadingComponent />}>
              <ObjectManager />
            </Suspense>
            <Routes>
              {allowedRoutes.map((route: any) => (
                <Route
                  key={route.path}
                  path={`${route.path}/*`}
                  element={
                    <Suspense fallback={<LoadingComponent />}>
                      <route.component {...route.props} />
                    </Suspense>
                  }
                />
              ))}
              <Route
                key={"icons"}
                path={"icons"}
                element={
                  <Suspense fallback={<LoadingComponent />}>
                    <IconsScreen />
                  </Suspense>
                }
              />
              <Route
                key={"components"}
                path={"components"}
                element={
                  <Suspense fallback={<LoadingComponent />}>
                    <ComponentsScreen />
                  </Suspense>
                }
              />
              <Route
                path={"*"}
                element={
                  <Fragment>
                    {allowedRoutes.length > 0 ? (
                      <Navigate to={allowedRoutes[0].path} />
                    ) : (
                      <Fragment />
                    )}
                  </Fragment>
                }
              />
            </Routes>
          </Fragment>
        </MainContainer>
      ) : null}
    </Fragment>
  );
};

export default Console;
