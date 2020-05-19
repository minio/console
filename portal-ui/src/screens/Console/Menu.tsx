// This file is part of MinIO Console Server
// Copyright (c) 2019 MinIO, Inc.
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
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import RoomServiceIcon from "@material-ui/icons/RoomService";
import WebAssetIcon from "@material-ui/icons/WebAsset";
import CenterFocusWeakIcon from "@material-ui/icons/CenterFocusWeak";
import ListItemText from "@material-ui/core/ListItemText";
import { NavLink } from "react-router-dom";
import { Divider, Typography, withStyles } from "@material-ui/core";
import { ExitToApp } from "@material-ui/icons";
import { AppState } from "../../store";
import { connect } from "react-redux";
import { userLoggedIn } from "../../actions";
import List from "@material-ui/core/List";
import storage from "local-storage-fallback";
import history from "../../history";
import logo from "../../icons/minio_console_logo.svg";
import {
  BucketsIcon,
  DashboardIcon,
  PermissionIcon,
  UsersIcon,
} from "../../icons";
import { createStyles, Theme } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import api from "../../common/api";
import NotificationsIcon from "@material-ui/icons/Notifications";
import ListAltIcon from "@material-ui/icons/ListAlt";
import LoopIcon from "@material-ui/icons/Loop";

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
        color: "white",
        background:
          "transparent linear-gradient(90deg, #362585 0%, #362585 7%, #281B6F 39%, #1F1661 100%) 0% 0% no-repeat padding-box",
        "& .MuiSvgIcon-root": {
          color: "white",
        },
      },
      "& .MuiListItem-root": {
        marginTop: "16px",
      },
      paddingLeft: "30px",
      "& .MuiSvgIcon-root": {
        fontSize: "18px",
        color: "#393939",
      },
      "& .MuiListItemIcon-root": {
        minWidth: "40px",
      },
      "& .MuiTypography-root": {
        fontSize: "14px",
      },
      "& .MuiListItem-gutters": {
        paddingRight: "0px",
      },
    },
  });

const mapState = (state: AppState) => ({
  open: state.system.loggedIn,
});

const connector = connect(mapState, { userLoggedIn });

interface MenuProps {
  classes: any;
  userLoggedIn: typeof userLoggedIn;
  pages: string[];
}

class Menu extends React.Component<MenuProps> {
  logout() {
    const deleteSession = () => {
      storage.removeItem("token");
      this.props.userLoggedIn(false);
      history.push("/");
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
  }

  render() {
    const { classes, pages } = this.props;
    const allowedPages = pages.reduce((result: any, item: any, index: any) => {
      result[item] = true;
      return result;
    }, {});

    const menu = [
      {
        type: "item",
        component: NavLink,
        to: "/dashboard",
        name: "Dashboard",
        icon: <DashboardIcon />,
      },
      {
        type: "item",
        component: NavLink,
        to: "/buckets",
        name: "Buckets",
        icon: <BucketsIcon />,
      },
      {
        type: "item",
        component: NavLink,
        to: "/service-accounts",
        name: "Service Accounts",
        icon: <RoomServiceIcon />,
        forceDisplay: true,
      },
      {
        type: "item",
        component: NavLink,
        to: "/watch",
        name: "Watch",
        icon: <CenterFocusWeakIcon />,
      },
      {
        type: "divider",
        key: "divider-1",
      },
      {
        type: "title",
        name: "Admin",
        component: Typography,
      },
      {
        group: "Admin",
        type: "item",
        component: NavLink,
        to: "/users",
        name: "Users",
        icon: <PersonIcon />,
      },
      {
        group: "Admin",
        type: "item",
        component: NavLink,
        to: "/groups",
        name: "Groups",
        icon: <UsersIcon />,
      },
      {
        group: "Admin",
        type: "item",
        component: NavLink,
        to: "/policies",
        name: "IAM Policies",
        icon: <PermissionIcon />,
      },
      {
        group: "Admin",
        type: "item",
        component: NavLink,
        to: "/trace",
        name: "Trace",
        icon: <LoopIcon />,
      },
      {
        group: "Admin",
        type: "item",
        component: NavLink,
        to: "/logs",
        name: "Console Logs",
        icon: <WebAssetIcon />,
      },
      {
        type: "title",
        name: "Configuration",
        component: Typography,
      },
      {
        group: "Configuration",
        type: "item",
        component: NavLink,
        to: "/notification-endpoints",
        name: "Lambda Notifications",
        icon: <NotificationsIcon />,
      },
      {
        group: "Configuration",
        type: "item",
        component: NavLink,
        to: "/configurations-list",
        name: "Configurations List",
        icon: <ListAltIcon />,
      },
      {
        type: "divider",
        key: "divider-2",
      },
    ];

    const allowedItems = menu.filter(
      (item: any) =>
        allowedPages[item.to] || item.forceDisplay || item.type !== "item"
    );

    return (
      <React.Fragment>
        <div className={classes.logo}>
          <img src={logo} alt="logo" />
        </div>
        <List className={classes.menuList}>
          {allowedItems.map((page: any) => {
            switch (page.type) {
              case "divider": {
                return <Divider key={page.key} />;
              }
              case "item": {
                return (
                  <ListItem
                    key={page.to}
                    button
                    component={page.component}
                    to={page.to}
                  >
                    {page.icon && <ListItemIcon>{page.icon}</ListItemIcon>}
                    {page.name && <ListItemText primary={page.name} />}
                  </ListItem>
                );
              }
              case "title": {
                return (
                  (allowedItems || []).filter(
                    (item: any) => item.group === page.name
                  ).length > 0 && (
                    <ListItem key={page.name} component={page.component}>
                      {page.name}
                    </ListItem>
                  )
                );
              }
              default:
            }
          })}
          <ListItem
            button
            onClick={() => {
              this.logout();
            }}
          >
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </React.Fragment>
    );
  }
}

export default connector(withStyles(styles)(Menu));
