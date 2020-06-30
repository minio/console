// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
import WebAssetIcon from "@material-ui/icons/WebAsset";
import HealingIcon from "@material-ui/icons/Healing";
import Collapse from "@material-ui/core/Collapse";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import { Divider, Typography, withStyles } from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";
import storage from "local-storage-fallback";
import { createStyles, Theme } from "@material-ui/core/styles";
import history from "../../../history";
import logo from "../../../icons/minio_console_logo.svg";
import { AppState } from "../../../store";
import { userLoggedIn } from "../../../actions";
import api from "../../../common/api";
import WatchIcon from "../../../icons/WatchIcon";
import { menuGroups } from "./utils";
import { IMenuProps } from "./types";
import {
  BucketsIcon,
  ClustersIcon,
  ConfigurationsListIcon,
  DashboardIcon,
  GroupsIcon,
  IAMPoliciesIcon,
  LambdaNotificationsIcon,
  MirroringIcon,
  ServiceAccountsIcon,
  TraceIcon,
  UsersIcon,
  WarpIcon,
} from "../../../icons";
import { clearSession } from "../../../common/utils";

const styles = (theme: Theme) =>
  createStyles({
    logo: {
      paddingTop: "42px",
      marginBottom: "20px",
      textAlign: "center",
      "& img": {
        width: "120px",
      },
    },
    menuList: {
      "& .active": {
        borderTopLeftRadius: "3px",
        borderBottomLeftRadius: "3px",
        color: "#fff",
        background:
          "transparent linear-gradient(90deg, #362585 0%, #362585 7%, #281B6F 39%, #1F1661 100%) 0% 0% no-repeat padding-box;",
        boxShadow: "4px 4px 4px #A5A5A512",
        fontWeight: 700,
        "& .MuiSvgIcon-root": {
          color: "white",
        },
        "& .MuiTypography-root": {
          color: "#fff",
        },
      },
      paddingLeft: "30px",
      "& .MuiSvgIcon-root": {
        fontSize: 16,
        color: "#362585",
        maxWidth: 14,
      },
      "& .MuiListItemIcon-root": {
        minWidth: "25px",
      },
      "& .MuiTypography-root": {
        fontSize: "12px",
        color: "#2e2e2e",
      },
      "& .MuiListItem-gutters": {
        paddingRight: 0,
      },
    },
    extraMargin: {
      "&.MuiListItem-gutters": {
        marginLeft: 5,
      },
    },
    groupTitle: {
      color: "#220c7c",
      fontSize: 10,
      textTransform: "uppercase",
      fontWeight: 700,
      marginBottom: 3,
      cursor: "pointer",
      userSelect: "none",
    },
    subTitleMenu: {
      fontWeight: 700,
      marginLeft: 10,
      "&.MuiTypography-root": {
        fontSize: 13,
        color: "#220c7c",
      },
    },
    selectorArrow: {
      marginLeft: 3,
      marginTop: 1,
      display: "inline-block",
      width: 0,
      height: 0,
      borderStyle: "solid",
      borderWidth: "3px 2.5px 0 2.5px",
      borderColor: "#220C7C transparent transparent transparent",
      transform: "rotateZ(0deg)",
      transitionDuration: "0.2s",
    },
    selectorArrowOpen: {
      transform: "rotateZ(180deg)",
    },
  });

const mapState = (state: AppState) => ({
  open: state.system.loggedIn,
});

const connector = connect(mapState, { userLoggedIn });

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

const Menu = ({ userLoggedIn, classes, pages }: IMenuProps) => {
  const [menuOpen, setMenuOpen] = useState<any>(menuStateBuilder());

  const logout = () => {
    const deleteSession = () => {
      clearSession();
      userLoggedIn(false);
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

  const menuItems = [
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
      to: "/buckets",
      name: "Buckets",
      icon: <BucketsIcon />,
    },
    {
      group: "User",
      type: "item",
      component: NavLink,
      to: "/service-accounts",
      name: "Service Accounts",
      icon: <ServiceAccountsIcon />,
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
      name: "Console Logs",
      icon: <WebAssetIcon />,
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
      icon: <HealingIcon />,
    },
    {
      group: "Admin",
      type: "title",
      name: "Configurations",
      component: Typography,
    },
    {
      group: "Admin",
      type: "item",
      component: NavLink,
      to: "/notification-endpoints",
      name: "Lambda Notifications",
      icon: <LambdaNotificationsIcon />,
      extraMargin: true,
    },
    {
      group: "Admin",
      type: "item",
      component: NavLink,
      to: "/configurations-list",
      name: "Configurations List",
      icon: <ConfigurationsListIcon />,
      extraMargin: true,
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
      to: "/mirroring",
      name: "Mirroring",
      icon: <MirroringIcon />,
    },
    {
      group: "Operator",
      type: "item",
      component: NavLink,
      to: "/warp",
      name: "Warp",
      icon: <WarpIcon />,
    },
  ];

  const allowedPages = pages.reduce((result: any, item: any, index: any) => {
    result[item] = true;
    return result;
  }, {});

  const allowedItems = menuItems.filter(
    (item: any) =>
      allowedPages[item.to] || item.forceDisplay || item.type !== "item"
  );

  const setMenuCollapse = (menuClicked: string) => {
    let newMenu: any = { ...menuOpen };

    newMenu[menuClicked] = !newMenu[menuClicked];

    setMenuOpen(newMenu);
  };

  return (
    <React.Fragment>
      <div className={classes.logo}>
        <img src={logo} alt="logo" />
      </div>
      <List className={classes.menuList}>
        {menuGroups.map((groupMember, index) => {
          const filterByGroup = (allowedItems || []).filter(
            (item: any) => item.group === groupMember.group
          );

          const countableElements = filterByGroup.filter(
            (menuItem: any) => menuItem.type !== "title"
          );

          if (countableElements.length == 0) {
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
                  {groupMember.label}
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
                {filterByGroup.map((page: any) => {
                  switch (page.type) {
                    case "item": {
                      return (
                        <ListItem
                          key={page.to}
                          button
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
                  }
                })}
                <Divider />
              </Collapse>
            </React.Fragment>
          );
        })}

        <ListItem button onClick={logout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </React.Fragment>
  );
};

export default connector(withStyles(styles)(Menu));
