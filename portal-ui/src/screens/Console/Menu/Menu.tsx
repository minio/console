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

import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { Drawer } from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import clsx from "clsx";
import { AppState } from "../../../store";
import { setMenuOpen, userLoggedIn } from "../../../actions";
import { IMenuItem } from "./types";

import { ErrorResponseHandler } from "../../../common/types";
import { clearSession } from "../../../common/utils";

import history from "../../../history";
import api from "../../../common/api";

import { resetSession } from "../actions";
import {
  DocumentationIcon,
  LambdaIcon,
  LicenseIcon,
  StorageIcon,
  TenantsOutlineIcon,
  TiersIcon,
} from "../../../icons";

import {
  AccessMenuIcon,
  AccountsMenuIcon,
  AuditLogsMenuIcon,
  BucketsMenuIcon,
  DrivesMenuIcon,
  GroupsMenuIcon,
  HealthMenuIcon,
  IdentityMenuIcon,
  LogsMenuIcon,
  MetricsMenuIcon,
  MonitoringMenuIcon,
  PerformanceMenuIcon,
  SupportMenuIcon,
  TraceMenuIcon,
  UsersMenuIcon,
} from "../../../icons/SidebarMenus/MenuIcons";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_PAGES_PERMISSIONS,
  IAM_SCOPES,
  S3_ALL_RESOURCES,
} from "../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../common/SecureComponent/SecureComponent";
import MenuToggle from "./MenuToggle";
import ConsoleMenuList from "./ConsoleMenuList";
import RegisterMenuIcon from "../../../icons/SidebarMenus/RegisterMenuIcon";
import SettingsIcon from "../../../icons/SettingsIcon";
import WatchIcon from "../../../icons/WatchIcon";

const drawerWidth = 245;

const styles = (theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
      background:
        "transparent linear-gradient(90deg, #073052 0%, #081C42 100%) 0% 0% no-repeat padding-box !important",
      boxShadow: "0px 3px 7px #00000014",
      "& .MuiPaper-root": {
        backgroundColor: "inherit",
      },
      "& ::-webkit-scrollbar": {
        width: "5px",
      },
      "& ::-webkit-scrollbar-track": {
        background: "#F0F0F0",
        borderRadius: 0,
        boxShadow: "inset 0px 0px 0px 0px #F0F0F0",
      },
      "& ::-webkit-scrollbar-thumb": {
        background: "#5A6375",
        borderRadius: 0,
      },
      "& ::-webkit-scrollbar-thumb:hover": {
        background: "#081C42",
      },
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      [theme.breakpoints.up("xs")]: {
        width: 75,
      },
    },
  });

interface IMenuProps {
  classes?: any;
  userLoggedIn: typeof userLoggedIn;
  operatorMode?: boolean;
  sidebarOpen: boolean;
  setMenuOpen: typeof setMenuOpen;
  features?: string[] | null;
}

const Menu = ({
  userLoggedIn,
  classes,
  operatorMode = false,
  sidebarOpen,
  setMenuOpen,
  features,
}: IMenuProps) => {
  const logout = () => {
    const deleteSession = () => {
      clearSession();
      userLoggedIn(false);
      localStorage.setItem("userLoggedIn", "");
      resetSession();
      history.push("/login");
    };
    api
      .invoke("POST", `/api/v1/logout`)
      .then(() => {
        deleteSession();
      })
      .catch((err: ErrorResponseHandler) => {
        console.log(err);
        deleteSession();
      });
  };

  const ldapIsEnabled = (features && features.includes("ldap-idp")) || false;

  let consoleMenus: IMenuItem[] = [
    {
      name: "Buckets",
      id: "buckets",
      component: NavLink,
      to: IAM_PAGES.BUCKETS,
      icon: BucketsMenuIcon,
      forceDisplay: true,
      children: [],
    },
    {
      name: "Identity",
      id: "identity",
      icon: IdentityMenuIcon,
      children: [
        {
          component: NavLink,
          id: "users",
          to: IAM_PAGES.USERS,
          customPermissionFnc: () =>
            hasPermission(CONSOLE_UI_RESOURCE, [IAM_SCOPES.ADMIN_LIST_USERS]) ||
            hasPermission(S3_ALL_RESOURCES, [IAM_SCOPES.ADMIN_CREATE_USER]),
          name: "Users",
          icon: UsersMenuIcon,
          fsHidden: ldapIsEnabled,
        },
        {
          component: NavLink,
          id: "groups",
          to: IAM_PAGES.GROUPS,
          name: "Groups",
          icon: GroupsMenuIcon,
          fsHidden: ldapIsEnabled,
        },
        {
          component: NavLink,
          id: "serviceaccounts",
          to: IAM_PAGES.ACCOUNT,
          name: "Service Accounts",
          icon: AccountsMenuIcon,
          forceDisplay: true,
        },
      ],
    },
    {
      name: "Access",
      component: NavLink,
      id: "access",
      to: IAM_PAGES.POLICIES,
      icon: AccessMenuIcon,
    },

    {
      name: "Monitoring",
      id: "tools",
      icon: MonitoringMenuIcon,
      children: [
        {
          name: "Metrics",
          id: "monitorMetrics",
          to: IAM_PAGES.DASHBOARD,
          icon: MetricsMenuIcon,
          component: NavLink,
        },
        {
          name: "Logs ",
          id: "monitorLogs",
          to: IAM_PAGES.TOOLS_LOGS,
          icon: LogsMenuIcon,
          component: NavLink,
        },
        {
          name: "Audit",
          id: "monitorAudit",
          to: IAM_PAGES.TOOLS_AUDITLOGS,
          icon: AuditLogsMenuIcon,
          component: NavLink,
        },
        {
          name: "Trace",
          id: "monitorTrace",
          to: IAM_PAGES.TOOLS_TRACE,
          icon: TraceMenuIcon,
          component: NavLink,
        },
        {
          name: "Watch",
          id: "watch",
          component: NavLink,
          icon: WatchIcon,
          to: IAM_PAGES.TOOLS_WATCH,
        },
        {
          name: "Drives",
          id: "monitorDrives",
          to: IAM_PAGES.TOOLS_HEAL,
          icon: DrivesMenuIcon,
          component: NavLink,
        },
      ],
    },
    {
      name: "Support",
      id: "support",
      icon: SupportMenuIcon,
      children: [
        {
          name: "Register",
          id: "register",
          component: NavLink,
          icon: RegisterMenuIcon,
          to: IAM_PAGES.REGISTER_SUPPORT,
        },
        {
          name: "Health",
          id: "diagnostics",
          component: NavLink,
          icon: HealthMenuIcon,
          to: IAM_PAGES.TOOLS_DIAGNOSTICS,
        },
        {
          name: "Performance",
          id: "diagnostics",
          component: NavLink,
          icon: PerformanceMenuIcon,
          to: IAM_PAGES.TOOLS_SPEEDTEST,
        },

        // {
        //   name: "Call Home",
        //   id: "callhome",
        //   component: NavLink,
        //   icon: CallHomeMenuIcon,
        //   to: IAM_PAGES.CALL_HOME,
        // },
        // {
        //   name: "Inspect",
        //   id: "inspect",
        //   component: NavLink,
        //   icon: InspectMenuIcon,
        //   to: IAM_PAGES.TOOLS_WATCH,
        // },
        // {
        //   name: "Profile",
        //   id: "profile",
        //   component: NavLink,
        //   icon: ProfileMenuIcon,
        //   to: IAM_PAGES.PROFILE,
        // },
      ],
    },
    {
      component: NavLink,
      to: IAM_PAGES.LICENSE,
      name: "License",
      id: "license",
      icon: LicenseIcon,
      forceDisplay: true,
    },
    {
      name: "Settings",
      id: "settings",
      icon: SettingsIcon,
      children: [
        {
          component: NavLink,
          to: IAM_PAGES.SETTINGS,
          name: "Configurations",
          id: "configurations",
          icon: SettingsIcon,
        },
        {
          component: NavLink,
          to: IAM_PAGES.NOTIFICATIONS_ENDPOINTS,
          name: "Notifications",
          icon: LambdaIcon,
          id: "lambda",
        },
        {
          component: NavLink,
          to: IAM_PAGES.TIERS,
          name: "Tiers",
          icon: TiersIcon,
          id: "tiers",
        },
      ],
    },
    {
      type: "item",
      component: NavLink,
      to: IAM_PAGES.DOCUMENTATION,
      name: "Documentation",
      icon: DocumentationIcon,
      forceDisplay: true,
      onClick: (
        e:
          | React.MouseEvent<HTMLLIElement>
          | React.MouseEvent<HTMLAnchorElement>
          | React.MouseEvent<HTMLDivElement>
      ) => {
        e.preventDefault();
        window.open("https://docs.min.io/?ref=con", "_blank");
      },
    },
  ];

  let operatorMenus: IMenuItem[] = [
    {
      group: "Operator",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.TENANTS,
      name: "Tenants",
      icon: TenantsOutlineIcon,
      forceDisplay: true,
    },
    {
      group: "Operator",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.STORAGE,
      name: "Storage",
      icon: StorageIcon,
      forceDisplay: true,
    },
    {
      group: "Operator",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.LICENSE,
      name: "License",
      icon: LicenseIcon,
      forceDisplay: true,
    },
    {
      group: "Operator",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.DOCUMENTATION,
      name: "Documentation",
      icon: DocumentationIcon,
      forceDisplay: true,
      onClick: (
        e:
          | React.MouseEvent<HTMLLIElement>
          | React.MouseEvent<HTMLAnchorElement>
          | React.MouseEvent<HTMLDivElement>
      ) => {
        e.preventDefault();
        window.open("https://docs.min.io/?ref=op", "_blank");
      },
    },
  ];

  const allowedItems = (operatorMode ? operatorMenus : consoleMenus).filter(
    (item: IMenuItem) => {
      if (item.children && item.children.length > 0) {
        const c = item.children?.filter((childItem: IMenuItem) => {
          return (
            ((childItem.customPermissionFnc
              ? childItem.customPermissionFnc()
              : hasPermission(
                  CONSOLE_UI_RESOURCE,
                  IAM_PAGES_PERMISSIONS[childItem.to ?? ""]
                )) ||
              childItem.forceDisplay) &&
            !childItem.fsHidden
          );
        });
        return c.length > 0;
      }

      const res =
        ((item.customPermissionFnc
          ? item.customPermissionFnc()
          : hasPermission(
              CONSOLE_UI_RESOURCE,
              IAM_PAGES_PERMISSIONS[item.to ?? ""]
            )) ||
          item.forceDisplay) &&
        !item.fsHidden;
      return res;
    }
  );

  return (
    <Drawer
      id="app-menu"
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: sidebarOpen,
        [classes.drawerClose]: !sidebarOpen,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: sidebarOpen,
          [classes.drawerClose]: !sidebarOpen,
        }),
      }}
    >
      <MenuToggle
        onToggle={(nextState) => {
          setMenuOpen(nextState);
        }}
        isOperatorMode={operatorMode}
        isOpen={sidebarOpen}
      />

      <ConsoleMenuList
        menuItems={allowedItems}
        isOpen={sidebarOpen}
        onLogoutClick={logout}
      />
    </Drawer>
  );
};
const mapState = (state: AppState) => ({
  sidebarOpen: state.system.sidebarOpen,
  operatorMode: state.system.operatorMode,
  features: state.console.session.features,
});

const connector = connect(mapState, {
  userLoggedIn,
  setMenuOpen,
});

export default connector(withStyles(styles)(Menu));
