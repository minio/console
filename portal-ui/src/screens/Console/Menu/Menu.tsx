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

import React, { useState } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DescriptionIcon from "@material-ui/icons/Description";
import Collapse from "@material-ui/core/Collapse";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import { Divider, withStyles } from "@material-ui/core";
import { createStyles, Theme } from "@material-ui/core/styles";
import history from "../../../history";
import logo from "../../../icons/minio_console_logo.svg";
import operator_logo from "../../../icons/minio_operator_logo.svg";
import { AppState } from "../../../store";
import { userLoggedIn } from "../../../actions";
import api from "../../../common/api";
import { menuGroups } from "./utils";
import { IMenuItem, IMenuProps } from "./types";
import {
  BucketsIcon,
  ClustersIcon,
  ConfigurationsListIcon,
  DashboardIcon,
  GroupsIcon,
  IAMPoliciesIcon,
  ServiceAccountsIcon,
  TraceIcon,
  UsersIcon,
} from "../../../icons";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import { clearSession } from "../../../common/utils";
import LicenseIcon from "../../../icons/LicenseIcon";
import LogoutIcon from "../../../icons/LogoutIcon";
import ConsoleIcon from "../../../icons/ConsoleIcon";
import HealIcon from "../../../icons/HealIcon";
import WatchIcon from "../../../icons/WatchIcon";
import TrackChangesSharpIcon from "@material-ui/icons/TrackChangesSharp";
import StorageIcon from "@material-ui/icons/Storage";

const styles = (theme: Theme) =>
  createStyles({
    logo: {
      paddingTop: 25,
      marginBottom: 30,
      paddingLeft: 45,
      "& img": {
        width: 120,
      },
    },
    menuList: {
      "& .active": {
        borderTopLeftRadius: 2,
        borderBottomLeftRadius: 2,
        color: "#fff",
        backgroundColor: "rgba(255, 255, 255, .18)",
        "& .MuiSvgIcon-root": {
          color: "white",
        },
        "& .MuiTypography-root": {
          color: "#fff",
          fontWeight: 700,
        },
      },
      "& .MuiSvgIcon-root": {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.8)",
        maxWidth: 14,
      },
      "& .MuiListItemIcon-root": {
        minWidth: 25,
      },
      "& .MuiTypography-root": {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
      },
      "& .MuiListItem-gutters": {
        paddingRight: 0,
        fontWeight: 300,
      },
      "& .MuiListItem-root": {
        padding: "2px 0 2px 16px",
        marginBottom: 8,
        marginLeft: 30,
        width: "calc(100% - 30px)",
      },
      "& .MuiCollapse-container .MuiCollapse-wrapper .MuiCollapse-wrapperInner .MuiDivider-root":
        {
          backgroundColor: "rgba(112,112,112,0.5)",
          marginBottom: 12,
          height: 1,
        },
    },
    extraMargin: {
      "&.MuiListItem-gutters": {
        marginLeft: 5,
      },
    },
    groupTitle: {
      color: "#fff",
      fontSize: 10,
      textTransform: "uppercase",
      fontWeight: 700,
      marginBottom: 3,
      cursor: "pointer",
      userSelect: "none",
      display: "flex",
      justifyContent: "space-between",
    },
    subTitleMenu: {
      fontWeight: 700,
      marginLeft: 10,
      "&.MuiTypography-root": {
        fontSize: 13,
        color: "#fff",
      },
    },
    selectorArrow: {
      marginRight: 20,
      marginTop: 1,
      display: "inline-block",
      width: 0,
      height: 0,
      borderStyle: "solid",
      borderWidth: "4px 4px 0 4px",
      borderColor:
        "rgba(255, 255, 255, .29) transparent transparent transparent",
      transform: "rotateZ(0deg)",
      transitionDuration: "0.2s",
    },
    selectorArrowOpen: {
      transform: "rotateZ(180deg)",
    },
  });

// Menu State builder for groups
const menuStateBuilder = () => {
  let elements: any = [];
  menuGroups.forEach((menuItem) => {
    if (menuItem.collapsible) {
      elements[menuItem.group] = true;
    }
  });

  return elements;
};

const Menu = ({
  userLoggedIn,
  classes,
  pages,
  operatorMode,
  distributedSetup,
}: IMenuProps) => {
  const [menuOpen, setMenuOpen] = useState<any>(menuStateBuilder());

  const logout = () => {
    const deleteSession = () => {
      clearSession();
      userLoggedIn(false);
      localStorage.setItem("userLoggedIn", "");

      history.push("/login");
    };
    api
      .invoke("POST", `/api/v1/logout`)
      .then(() => {
        deleteSession();
      })
      .catch((err: any) => {
        console.log(err);
        deleteSession();
      });
  };

  let menuItems: IMenuItem[] = [
    {
      group: "common",
      type: "item",
      component: NavLink,
      to: "/dashboard",
      name: "Dashboard",
      icon: <DashboardIcon />,
    },
    {
      group: "User",
      type: "item",
      component: NavLink,
      to: "/object-browser",
      name: "Object Browser",
      icon: <DescriptionIcon />,
    },
    {
      group: "User",
      type: "item",
      component: NavLink,
      to: "/account",
      name: "Account",
      icon: <ServiceAccountsIcon />,
    },
    {
      group: "Admin",
      type: "item",
      component: NavLink,
      to: "/buckets",
      name: "Buckets",
      icon: <BucketsIcon />,
    },
    {
      group: "Admin",
      type: "item",
      component: NavLink,
      to: "/users",
      name: "Users",
      icon: <UsersIcon />,
    },
    {
      group: "Admin",
      type: "item",
      component: NavLink,
      to: "/groups",
      name: "Groups",
      icon: <GroupsIcon />,
    },
    {
      group: "Admin",
      type: "item",
      component: NavLink,
      to: "/policies",
      name: "IAM Policies",
      icon: <IAMPoliciesIcon />,
    },
    {
      group: "Tools",
      type: "item",
      component: NavLink,
      to: "/logs",
      name: "Logs",
      icon: <ConsoleIcon />,
    },
    {
      group: "Tools",
      type: "item",
      component: NavLink,
      to: "/watch",
      name: "Watch",
      icon: <WatchIcon />,
    },
    {
      group: "Tools",
      type: "item",
      component: NavLink,
      to: "/trace",
      name: "Trace",
      icon: <TraceIcon />,
    },
    {
      group: "Tools",
      type: "item",
      component: NavLink,
      to: "/heal",
      name: "Heal",
      icon: <HealIcon />,
      fsHidden: distributedSetup,
    },
    {
      group: "Tools",
      type: "item",
      component: NavLink,
      to: "/health-info",
      name: "Diagnostic",
      icon: <TrackChangesSharpIcon />,
    },
    {
      group: "Admin",
      type: "item",
      component: NavLink,
      to: "/settings",
      name: "Settings",
      icon: <ConfigurationsListIcon />,
    },
    {
      group: "Operator",
      type: "item",
      component: NavLink,
      to: "/tenants",
      name: "Tenants",
      icon: <ClustersIcon />,
    },
    {
      group: "Operator",
      type: "item",
      component: NavLink,
      to: "/storage",
      name: "Storage",
      icon: <StorageIcon />,
    },
  ];

  const allowedPages = pages.reduce((result: any, item: any) => {
    result[item] = true;
    return result;
  }, {});

  const documentation: IMenuItem = {
    group: "License",
    type: "item",
    component: NavLink,
    to: "/documentation",
    name: "Documentation",
    icon: <LibraryBooksIcon />,
    forceDisplay: true,
  };

  // Append the license page according to the allowedPages
  if (allowedPages.hasOwnProperty("/tenants")) {
    menuItems.push(
      {
        group: "Operator",
        type: "item",
        component: NavLink,
        to: "/license",
        name: "License",
        icon: <LicenseIcon />,
      },
      {
        ...documentation,
        group: "Operator",
        onClick: (
          e:
            | React.MouseEvent<HTMLLIElement>
            | React.MouseEvent<HTMLAnchorElement>
            | React.MouseEvent<HTMLDivElement>
        ) => {
          e.preventDefault();
          window.open(
            `https://docs.min.io/?ref=${operatorMode ? "op" : "con"}`,
            "_blank"
          );
        },
      }
    );
  } else {
    menuItems.push(
      {
        group: "License",
        type: "item",
        component: NavLink,
        to: "/license",
        name: "License",
        icon: <LicenseIcon />,
      },
      {
        ...documentation,
        group: "License",
        onClick: (
          e:
            | React.MouseEvent<HTMLLIElement>
            | React.MouseEvent<HTMLAnchorElement>
            | React.MouseEvent<HTMLDivElement>
        ) => {
          e.preventDefault();
          window.open(
            `https://docs.min.io/?ref=${operatorMode ? "op" : "con"}`,
            "_blank"
          );
        },
      }
    );
  }

  const allowedItems = menuItems.filter(
    (item: any) =>
      (allowedPages[item.to] || item.forceDisplay || item.type !== "item") &&
      item.fsHidden !== false
  );

  const setMenuCollapse = (menuClicked: string) => {
    let newMenu: any = { ...menuOpen };

    newMenu[menuClicked] = !newMenu[menuClicked];

    setMenuOpen(newMenu);
  };

  return (
    <React.Fragment>
      <div className={classes.logo}>
        <img src={operatorMode ? operator_logo : logo} alt="logo" />
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
              {groupMember.label !== "" && (
                <ListItem
                  className={classes.groupTitle}
                  onClick={() => {
                    if (groupMember.collapsible) {
                      setMenuCollapse(groupMember.group);
                    }
                  }}
                >
                  <span>{groupMember.label}</span>
                  {groupMember.collapsible && (
                    <span
                      className={`${classes.selectorArrow} ${
                        menuOpen[groupMember.group]
                          ? classes.selectorArrowOpen
                          : ""
                      }`}
                    />
                  )}
                </ListItem>
              )}
              <Collapse
                in={
                  groupMember.collapsible ? menuOpen[groupMember.group] : true
                }
                timeout="auto"
                unmountOnExit
                key={`menuGroup-${groupMember.group}`}
              >
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
                            <ListItemIcon>{page.icon}</ListItemIcon>
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
                <Divider />
              </Collapse>
            </React.Fragment>
          );
        })}

        <ListItem button onClick={logout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </React.Fragment>
  );
};

const mapState = (state: AppState) => ({
  open: state.system.loggedIn,
  operatorMode: state.system.operatorMode,
  distributedSetup: state.system.distributedSetup,
});

const connector = connect(mapState, { userLoggedIn });

export default connector(withStyles(styles)(Menu));
