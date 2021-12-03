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

import React, { Suspense } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { Divider, Drawer, IconButton, Tooltip } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import clsx from "clsx";
import { AppState } from "../../../store";
import { setMenuOpen, userLoggedIn } from "../../../actions";
import { menuGroups } from "./utils";
import { IMenuItem } from "./types";

import { ErrorResponseHandler } from "../../../common/types";
import { clearSession } from "../../../common/utils";

import OperatorLogo from "../../../icons/OperatorLogo";
import ConsoleLogo from "../../../icons/ConsoleLogo";
import history from "../../../history";
import api from "../../../common/api";

import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "../../../icons/LogoutIcon";
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
  VersionIcon,
} from "../../../icons";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES_PERMISSIONS,
  IAM_PAGES,
  S3_ALL_RESOURCES,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import { hasPermission } from "../../../common/SecureComponent/SecureComponent";

const drawerWidth = 245;

const styles = (theme: Theme) =>
  createStyles({
    logo: {
      paddingTop: 25,
      height: 80,
      marginBottom: 30,
      paddingLeft: 45,
      borderBottom: "#1C3B64 1px solid",
      transition: theme.transitions.create("paddingLeft", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      "& img": {
        width: 120,
      },
      "& .MuiIconButton-root": {
        color: "#ffffff",
        float: "right",
      },
    },
    logoClosed: {
      paddingTop: 25,
      marginBottom: 0,
      paddingLeft: 34,
      transition: theme.transitions.create("paddingLeft", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      "& .MuiIconButton-root": {
        color: "#ffffff",
      },
    },
    menuList: {
      "& .active": {
        color: "#fff",
        backgroundBlendMode: "multiply",
        background:
          "transparent linear-gradient(90deg, rgba(0, 0, 0, 0.14) 0%, #00000000 100%) 0% 0% no-repeat padding-box",
        "& .min-icon": {
          color: "white",
        },
        "& .MuiTypography-root": {
          color: "#fff",
          fontWeight: "bold",
        },
      },
      "& .min-icon": {
        width: 16,
        height: 16,
        fill: "rgba(255, 255, 255, 0.8)",
      },
      "& .MuiListItemIcon-root": {
        minWidth: 36,
      },
      "& .MuiTypography-root": {
        fontSize: 15,
        color: "rgba(255, 255, 255, 0.8)",
      },
      "& .MuiListItem-gutters": {
        paddingRight: 0,
        fontWeight: 300,
      },
      "& .MuiListItem-root": {
        padding: "2px 0 2px 16px",
        marginLeft: 36,
        height: 50,
        width: "calc(100% - 30px)",
      },
    },
    menuDivider: {
      backgroundColor: "#1C3B64",
      marginRight: 36,
      marginLeft: 36,
      marginBottom: 0,
      height: 1,
    },
    extraMargin: {
      "&.MuiListItem-gutters": {
        marginLeft: 5,
      },
    },
    subTitleMenu: {
      fontWeight: 700,
      marginLeft: 10,
      "&.MuiTypography-root": {
        fontSize: 13,
        color: "#fff",
      },
    },
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
      width: 115,
      [theme.breakpoints.up("sm")]: {
        width: 115,
      },
      "& .logo": {
        background: "red",
      },
      "& .MuiListItem-root": {
        padding: "2px 0 2px 16px",
        marginLeft: 36,
        height: 50,
        width: "48px",
        transition: theme.transitions.create("marginLeft", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        "& .MuiListItemText-root": {
          display: "none",
        },
      },
    },
    logoIcon: {
      float: "left",
      "& svg": {
        fill: "white",
        width: 120,
      },
    },
    logoIconClosed: {
      color: "white",
      "& .min-icon": {
        marginLeft: 11,
        width: 24,
        fill: "rgba(255, 255, 255, 0.8)",
      },
    },
  });

interface IMenuProps {
  classes: any;
  userLoggedIn: typeof userLoggedIn;
  operatorMode: boolean;
  distributedSetup: boolean;
  sidebarOpen: boolean;
  setMenuOpen: typeof setMenuOpen;
  resetSession: typeof resetSession;
  features: string[] | null;
}

const Menu = ({
  userLoggedIn,
  classes,
  operatorMode,
  distributedSetup,
  sidebarOpen,
  setMenuOpen,
  resetSession,
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
    <React.Fragment>
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
        <div
          className={clsx({
            [classes.logo]: sidebarOpen,
            [classes.logoClosed]: !sidebarOpen,
          })}
        >
          {sidebarOpen && (
            <span className={classes.logoIcon}>
              {operatorMode ? <OperatorLogo /> : <ConsoleLogo />}
            </span>
          )}
          {!sidebarOpen && (
            <div className={classes.logoIconClosed}>
              <Suspense fallback={<div>Loading...</div>}>
                <VersionIcon />
              </Suspense>
            </div>
          )}
          <IconButton
            onClick={() => {
              if (sidebarOpen) {
                setMenuOpen(false);
              } else {
                setMenuOpen(true);
              }
            }}
            size="large"
          >
            {sidebarOpen ? <ChevronLeft /> : <MenuIcon />}
          </IconButton>
        </div>
        <List className={classes.menuList}>
          {menuGroups.map((groupMember, index) => {
            const filterByGroup = (allowedItems || []).filter(
              (item: any) => item.group === groupMember.group
            );

            const countableElements = filterByGroup.filter(
              (menuItem: any) => menuItem.type !== "title"
            );

            if (countableElements.length === 0) {
              return null;
            }

            return (
              <React.Fragment key={`menuElem-${index.toString()}`}>
                {index !== 0 && <Divider className={classes.menuDivider} />}
                {filterByGroup.map((page: IMenuItem) => {
                  switch (page.type) {
                    case "item": {
                      return (
                        <ListItem
                          key={page.to}
                          button
                          onClick={page.onClick}
                          component={page.component}
                          to={page.to}
                          className={
                            page.extraMargin ? classes.extraMargin : null
                          }
                        >
                          {page.icon && (
                            <Tooltip title={page.name}>
                              <div>
                                <ListItemIcon>
                                  <Suspense fallback={<div>Loading...</div>}>
                                    <page.icon />
                                  </Suspense>
                                </ListItemIcon>
                              </div>
                            </Tooltip>
                          )}
                          {page.name && <ListItemText primary={page.name} />}
                        </ListItem>
                      );
                    }
                    case "title": {
                      return (
                        <ListItem
                          key={page.name}
                          component={page.component}
                          className={classes.subTitleMenu}
                        >
                          {page.name}
                        </ListItem>
                      );
                    }
                    default:
                      return null;
                  }
                })}
              </React.Fragment>
            );
          })}
          <Divider className={classes.menuDivider} />
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </React.Fragment>
  );
};
const mapState = (state: AppState) => ({
  sidebarOpen: state.system.sidebarOpen,
  operatorMode: state.system.operatorMode,
  distributedSetup: state.system.distributedSetup,
  features: state.console.session.features,
});

const connector = connect(mapState, {
  userLoggedIn,
  setMenuOpen,
  resetSession,
});

export default connector(withStyles(styles)(Menu));
