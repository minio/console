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
import { Theme } from "@mui/material/styles";
import { Button } from "mds";
import debounce from "lodash/debounce";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import { LinearProgress } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Snackbar from "@mui/material/Snackbar";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch } from "../../store";
import { snackBarCommon } from "./Common/FormComponents/common/styleLibrary";
import { ErrorResponseHandler } from "../../common/types";
import Menu from "./Menu/Menu";
import api from "../../common/api";
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
import LoadingComponent from "../../common/LoadingComponent";
import EditPool from "./Tenants/TenantDetails/Pools/EditPool/EditPool";
import ComponentsScreen from "./Common/ComponentsScreen";
import {
  menuOpen,
  selDirectPVMode,
  selDistSet,
  selOpMode,
  serverIsLoading,
  setServerNeedsRestart,
  setSnackBarMessage,
} from "../../systemSlice";
import { selFeatures, selSession } from "./consoleSlice";

const Trace = React.lazy(() => import("./Trace/Trace"));
const Heal = React.lazy(() => import("./Heal/Heal"));
const Watch = React.lazy(() => import("./Watch/Watch"));
const HealthInfo = React.lazy(() => import("./HealthInfo/HealthInfo"));
const Hop = React.lazy(() => import("./Tenants/TenantDetails/hop/Hop"));
const RegisterOperator = React.lazy(() => import("./Support/RegisterOperator"));

const AddTenant = React.lazy(() => import("./Tenants/AddTenant/AddTenant"));

const NotificationEndpoints = React.lazy(
  () => import("./NotificationEndpoints/NotificationEndpoints")
);
const AddNotificationEndpoint = React.lazy(
  () => import("./NotificationEndpoints/AddNotificationEndpoint")
);
const NotificationTypeSelector = React.lazy(
  () => import("./NotificationEndpoints/NotificationTypeSelector")
);

const ListTiersConfiguration = React.lazy(
  () => import("./Configurations/TiersConfiguration/ListTiersConfiguration")
);
const TierTypeSelector = React.lazy(
  () => import("./Configurations/TiersConfiguration/TierTypeSelector")
);
const AddTierConfiguration = React.lazy(
  () => import("./Configurations/TiersConfiguration/AddTierConfiguration")
);
const ListTenants = React.lazy(
  () => import("./Tenants/ListTenants/ListTenants")
);

const ErrorLogs = React.lazy(() => import("./Logs/ErrorLogs/ErrorLogs"));
const LogsSearchMain = React.lazy(
  () => import("./Logs/LogSearch/LogsSearchMain")
);
const GroupsDetails = React.lazy(() => import("./Groups/GroupsDetails"));

const Tools = React.lazy(() => import("./Tools/Tools"));
const Health = React.lazy(() => import("./Health"));
const IconsScreen = React.lazy(() => import("./Common/IconsScreen"));

const Speedtest = React.lazy(() => import("./Speedtest/Speedtest"));

const ObjectManager = React.lazy(
  () => import("./Common/ObjectManager/ObjectManager")
);

const ObjectBrowser = React.lazy(() => import("./ObjectBrowser/ObjectBrowser"));

const Buckets = React.lazy(() => import("./Buckets/Buckets"));
const Policies = React.lazy(() => import("./Policies/Policies"));

const AddPolicyScreen = React.lazy(() => import("./Policies/AddPolicyScreen"));
const Dashboard = React.lazy(() => import("./Dashboard/Dashboard"));

const Account = React.lazy(() => import("./Account/Account"));

const AccountCreate = React.lazy(
  () => import("./Account/AddServiceAccountScreen")
);

const Users = React.lazy(() => import("./Users/Users"));
const Groups = React.lazy(() => import("./Groups/Groups"));
const IDPLDAPConfigurations = React.lazy(
  () => import("./IDP/IDPLDAPConfigurations")
);
const IDPOpenIDConfigurations = React.lazy(
  () => import("./IDP/IDPOpenIDConfigurations")
);
const AddIDPLDAPConfiguration = React.lazy(
  () => import("./IDP/AddIDPLDAPConfiguration")
);
const AddIDPOpenIDConfiguration = React.lazy(
  () => import("./IDP/AddIDPOpenIDConfiguration")
);
const IDPLDAPConfigurationDetails = React.lazy(
  () => import("./IDP/IDPLDAPConfigurationDetails")
);
const IDPOpenIDConfigurationDetails = React.lazy(
  () => import("./IDP/IDPOpenIDConfigurationDetails")
);

const TenantDetails = React.lazy(
  () => import("./Tenants/TenantDetails/TenantDetails")
);
const License = React.lazy(() => import("./License/License"));
const Marketplace = React.lazy(() => import("./Marketplace/Marketplace"));
const ConfigurationOptions = React.lazy(
  () => import("./Configurations/ConfigurationPanels/ConfigurationOptions")
);
const AddPool = React.lazy(
  () => import("./Tenants/TenantDetails/Pools/AddPool/AddPool")
);
const AddGroupScreen = React.lazy(() => import("./Groups/AddGroupScreen"));
const SiteReplication = React.lazy(
  () => import("./Configurations/SiteReplication/SiteReplication")
);
const SiteReplicationStatus = React.lazy(
  () => import("./Configurations/SiteReplication/SiteReplicationStatus")
);

const AddReplicationSites = React.lazy(
  () => import("./Configurations/SiteReplication/AddReplicationSites")
);

const StoragePVCs = React.lazy(() => import("./Storage/StoragePVCs"));

const DirectPVDrives = React.lazy(() => import("./DirectPV/DirectPVDrives"));

const DirectPVVolumes = React.lazy(() => import("./DirectPV/DirectPVVolumes"));

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      "& .MuiPaper-root.MuiSnackbarContent-root": {
        borderRadius: "0px 0px 5px 5px",
        boxShadow: "none",
      },
    },
    content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
      position: "relative",
    },
    warningBar: {
      background: theme.palette.primary.main,
      color: "white",
      heigh: "60px",
      widht: "100%",
      lineHeight: "60px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "& button": {
        marginLeft: 8,
      },
    },
    progress: {
      height: "3px",
      backgroundColor: "#eaeaea",
    },
    ...snackBarCommon,
  });

interface IConsoleProps {
  classes: any;
}

const Console = ({ classes }: IConsoleProps) => {
  const dispatch = useAppDispatch();
  const { pathname = "" } = useLocation();
  const open = useSelector((state: AppState) => state.system.sidebarOpen);
  const session = useSelector(selSession);
  const features = useSelector(selFeatures);
  const distributedSetup = useSelector(selDistSet);
  const operatorMode = useSelector(selOpMode);
  const directPVMode = useSelector(selDirectPVMode);
  const snackBarMessage = useSelector(
    (state: AppState) => state.system.snackBar
  );
  const needsRestart = useSelector(
    (state: AppState) => state.system.serverNeedsRestart
  );
  const isServerLoading = useSelector(
    (state: AppState) => state.system.serverIsLoading
  );
  const loadingProgress = useSelector(
    (state: AppState) => state.system.loadingProgress
  );

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  const ldapIsEnabled = (features && features.includes("ldap-idp")) || false;
  const obOnly = !!features?.includes("object-browser-only");

  const restartServer = () => {
    dispatch(serverIsLoading(true));
    api
      .invoke("POST", "/api/v1/service/restart", {})
      .then((res) => {
        console.log("success restarting service");
        dispatch(serverIsLoading(false));
        dispatch(setServerNeedsRestart(false));
      })
      .catch((err: ErrorResponseHandler) => {
        if (err.errorMessage === "Error 502") {
          dispatch(setServerNeedsRestart(false));
        }
        dispatch(serverIsLoading(false));
        console.log("failure restarting service");
        console.error(err);
      });
  };

  // Layout effect to be executed after last re-render for resizing only
  useLayoutEffect(() => {
    // Debounce to not execute constantly
    const debounceSize = debounce(() => {
      if (open && window.innerWidth <= 800) {
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
            IAM_PAGES_PERMISSIONS[IAM_PAGES.OBJECT_BROWSER_VIEW]
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
            IAM_PAGES_PERMISSIONS[IAM_PAGES.BUCKETS_ADMIN_VIEW]
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
      component: IDPLDAPConfigurations,
      path: IAM_PAGES.IDP_LDAP_CONFIGURATIONS,
    },
    {
      component: IDPOpenIDConfigurations,
      path: IAM_PAGES.IDP_OPENID_CONFIGURATIONS,
    },
    {
      component: AddIDPLDAPConfiguration,
      path: IAM_PAGES.IDP_LDAP_CONFIGURATIONS_ADD,
    },
    {
      component: AddIDPOpenIDConfiguration,
      path: IAM_PAGES.IDP_OPENID_CONFIGURATIONS_ADD,
    },
    {
      component: IDPLDAPConfigurationDetails,
      path: IAM_PAGES.IDP_LDAP_CONFIGURATIONS_VIEW,
    },
    {
      component: IDPOpenIDConfigurationDetails,
      path: IAM_PAGES.IDP_OPENID_CONFIGURATIONS_VIEW,
    },
    {
      component: Heal,
      path: IAM_PAGES.TOOLS_HEAL,
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
      component: Health,
      path: IAM_PAGES.HEALTH,
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
      component: AddNotificationEndpoint,
      path: IAM_PAGES.NOTIFICATIONS_ENDPOINTS_ADD_SERVICE,
    },
    {
      component: NotificationTypeSelector,
      path: IAM_PAGES.NOTIFICATIONS_ENDPOINTS_ADD,
    },
    {
      component: NotificationEndpoints,
      path: IAM_PAGES.NOTIFICATIONS_ENDPOINTS,
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
  ];

  const operatorConsoleRoutes: IRouteRule[] = [
    {
      component: ListTenants,
      path: IAM_PAGES.TENANTS,
      forceDisplay: true,
    },
    {
      component: AddTenant,
      path: IAM_PAGES.TENANTS_ADD,
      forceDisplay: true,
    },
    {
      component: TenantDetails,
      path: IAM_PAGES.NAMESPACE_TENANT,
      forceDisplay: true,
    },
    {
      component: Hop,
      path: IAM_PAGES.NAMESPACE_TENANT_HOP,
      forceDisplay: true,
    },
    {
      component: AddPool,
      path: IAM_PAGES.NAMESPACE_TENANT_POOLS_ADD,
      forceDisplay: true,
    },
    {
      component: EditPool,
      path: IAM_PAGES.NAMESPACE_TENANT_POOLS_EDIT,
      forceDisplay: true,
    },
    {
      component: License,
      path: IAM_PAGES.LICENSE,
      forceDisplay: true,
    },
    {
      component: RegisterOperator,
      path: IAM_PAGES.REGISTER_SUPPORT,
      forceDisplay: true,
    },
    {
      component: Marketplace,
      path: IAM_PAGES.OPERATOR_MARKETPLACE,
      forceDisplay: true,
    },
  ];

  const directPVRoutes: IRouteRule[] = [
    {
      component: StoragePVCs,
      path: IAM_PAGES.DIRECTPV_STORAGE,
      forceDisplay: true,
    },
    {
      component: DirectPVDrives,
      path: IAM_PAGES.DIRECTPV_DRIVES,
      forceDisplay: true,
    },
    {
      component: DirectPVVolumes,
      path: IAM_PAGES.DIRECTPV_VOLUMES,
      forceDisplay: true,
    },
    {
      component: License,
      path: IAM_PAGES.LICENSE,
      forceDisplay: true,
    },
  ];

  let routes = consoleAdminRoutes;

  if (directPVMode) {
    routes = directPVRoutes;
  } else if (operatorMode) {
    routes = operatorConsoleRoutes;
  }

  const allowedRoutes = routes.filter((route: any) =>
    obOnly
      ? route.path.includes("buckets")
      : (route.forceDisplay ||
          (route.customPermissionFnc
            ? route.customPermissionFnc()
            : hasPermission(
                CONSOLE_UI_RESOURCE,
                IAM_PAGES_PERMISSIONS[route.path]
              ))) &&
        !route.fsHidden
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
  if (features?.includes("hide-menu")) {
    hideMenu = true;
  } else if (pathname.endsWith("/hop")) {
    hideMenu = true;
  } else if (obOnly) {
    hideMenu = true;
  }

  return (
    <Fragment>
      {session && session.status === "ok" ? (
        <div className={classes.root}>
          <CssBaseline />
          {!hideMenu && <Menu />}

          <main className={classes.content}>
            {needsRestart && (
              <div className={classes.warningBar}>
                {isServerLoading ? (
                  <Fragment>
                    The server is restarting.
                    <LinearProgress className={classes.progress} />
                  </Fragment>
                ) : (
                  <Fragment>
                    The instance needs to be restarted for configuration changes
                    to take effect.{" "}
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
              </div>
            )}
            {loadingProgress < 100 && (
              <LinearProgress
                className={classes.progress}
                variant="determinate"
                value={loadingProgress}
              />
            )}
            <MainError />
            <div className={classes.snackDiv}>
              <Snackbar
                open={openSnackbar}
                onClose={() => {
                  closeSnackBar();
                }}
                autoHideDuration={
                  snackBarMessage.type === "error" ? 10000 : 5000
                }
                message={snackBarMessage.message}
                className={classes.snackBarExternal}
                ContentProps={{
                  className: `${classes.snackBar} ${
                    snackBarMessage.type === "error"
                      ? classes.errorSnackBar
                      : ""
                  }`,
                }}
              />
            </div>
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
          </main>
        </div>
      ) : null}
    </Fragment>
  );
};

export default withStyles(styles)(Console);
