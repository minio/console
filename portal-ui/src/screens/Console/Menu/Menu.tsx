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
  AccountIcon,
  BucketsIcon,
  DashboardIcon,
  DocumentationIcon,
  GroupsIcon,
  IAMPoliciesIcon,
  LambdaIcon,
  LicenseIcon,
  SettingsIcon,
  StorageIcon,
  TenantsOutlineIcon,
  TiersIcon,
  ToolsIcon,
  UsersIcon,
} from "../../../icons";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES_PERMISSIONS,
  IAM_PAGES,
  S3_ALL_RESOURCES,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../common/SecureComponent/SecureComponent";
import MenuList from "./MenuList";
import MenuToggle from "./MenuToggle";

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
  let menuConsoleAdmin: IMenuItem[] = [
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.DASHBOARD,
      name: "Dashboard",
      icon: DashboardIcon,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.BUCKETS,
      name: "Buckets",
      icon: BucketsIcon,
      forceDisplay: true,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.USERS,
      customPermissionFnc: () =>
        hasPermission(CONSOLE_UI_RESOURCE, [IAM_SCOPES.ADMIN_LIST_USERS]) ||
        hasPermission(S3_ALL_RESOURCES, [IAM_SCOPES.ADMIN_CREATE_USER]),
      name: "Users",
      icon: UsersIcon,
      fsHidden: ldapIsEnabled,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.GROUPS,
      name: "Groups",
      icon: GroupsIcon,
      fsHidden: ldapIsEnabled,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.ACCOUNT,
      name: "Service Accounts",
      icon: AccountIcon,
      forceDisplay: true,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.POLICIES,
      name: "IAM Policies",
      icon: IAMPoliciesIcon,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.SETTINGS,
      name: "Settings",
      icon: SettingsIcon,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.NOTIFICATIONS_ENDPOINTS,
      name: "Notification Endpoints",
      icon: LambdaIcon,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.TIERS,
      name: "Tiers",
      icon: TiersIcon,
    },
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.TOOLS,
      name: "Tools",
      icon: ToolsIcon,
    },
    {
      group: "License",
      type: "item",
      component: NavLink,
      to: IAM_PAGES.LICENSE,
      name: "License",
      icon: LicenseIcon,
      forceDisplay: true,
    },
    {
      group: "License",
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

  let menuOperatorConsole: IMenuItem[] = [
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

  const allowedItems = (
    operatorMode ? menuOperatorConsole : menuConsoleAdmin
  ).filter(
    (item: any) =>
      ((item.customPermissionFnc
        ? item.customPermissionFnc()
        : hasPermission(CONSOLE_UI_RESOURCE, IAM_PAGES_PERMISSIONS[item.to])) ||
        item.forceDisplay ||
        item.type !== "item") &&
      !item.fsHidden
  );

  return (
    <Drawer
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

      <MenuList
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
