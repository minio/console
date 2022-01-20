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

import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "../../../icons/LogoutIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import {
  menuItemContainerStyles,
  menuItemIconStyles,
  menuItemMiniStyles,
  menuItemTextStyles,
} from "./MenuStyleUtils";
import { DocumentationIcon, SettingsIcon } from "../../../icons";
import MenuItem from "./MenuItem";
import { NavLink, useLocation } from "react-router-dom";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES,
  IAM_SCOPES,
} from "../../../common/SecureComponent/permissions";
import SecureComponent from "../../../common/SecureComponent/SecureComponent";

const ConsoleMenuList = ({
  menuItems,
  onLogoutClick,
  isOpen,
}: {
  menuItems: any[];
  isOpen: boolean;
  onLogoutClick: () => void;
}) => {
  const stateClsName = isOpen ? "wide" : "mini";
  const { pathname = "" } = useLocation();
  let expandedGroup = pathname.slice(1, pathname.length); //single path
  if (expandedGroup.indexOf("/") !== -1) {
    expandedGroup = expandedGroup.slice(0, expandedGroup.indexOf("/")); //nested path
  }

  const [openGroup, setOpenGroup] = useState<any>(expandedGroup);

  useEffect(() => {
    //in case of redirects.
    setOpenGroup(expandedGroup);
  }, [expandedGroup]);

  return (
    <Box
      className={`${stateClsName} wrapper`}
      sx={{
        display: "flex",
        flexFlow: "column",
        justifyContent: "space-between",
        height: "100%",
        flex: 1,
        marginTop: "35px",
        paddingRight: "8px",

        "&.wide": {
          marginLeft: "30px",
        },

        "&.mini": {
          marginLeft: "10px",
          marginTop: "30px",
          xs: {
            marginTop: "30px",
          },
        },
      }}
    >
      <List
        sx={{
          flex: 1,
          paddingTop: 0,

          "&.mini": {
            padding: 0,
            display: "flex",
            alignItems: "center",
            flexFlow: "column",

            "& .main-menu-item": {
              marginBottom: "20px",
            },
          },
        }}
        className={`${stateClsName} group-wrapper main-list`}
      >
        <React.Fragment>
          {(menuItems || []).map((menuGroup: any) => {
            if (menuGroup) {
              return (
                <MenuItem
                  stateClsName={stateClsName}
                  page={menuGroup}
                  key={menuGroup.id}
                  id={menuGroup.id}
                  onExpand={setOpenGroup}
                  expandedValue={openGroup}
                  pathValue={pathname}
                />
              );
            }
            return null;
          })}
        </React.Fragment>
      </List>
      {/* List of Bottom anchored menus */}
      <List
        sx={{
          paddingTop: 0,
          "&.mini": {
            padding: 0,
            margin: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexFlow: "column",
          },
        }}
        className={`${stateClsName} group-wrapper bottom-list`}
      >
        <SecureComponent
          scopes={[IAM_SCOPES.ADMIN_CONFIG_UPDATE]}
          resource={CONSOLE_UI_RESOURCE}
        >
          <ListItem
            key={IAM_PAGES.SETTINGS}
            button
            to={IAM_PAGES.SETTINGS}
            disableRipple
            component={NavLink}
            className={`$ ${stateClsName} bottom-menu-item`}
            sx={{
              ...menuItemContainerStyles,
              ...menuItemMiniStyles,
              marginBottom: "3px",
            }}
          >
            <ListItemIcon
              sx={{
                ...menuItemIconStyles,
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              sx={{
                ...menuItemTextStyles,
              }}
              className={stateClsName}
            />
          </ListItem>
        </SecureComponent>

        <ListItem
          button
          onClick={(
            e:
              | React.MouseEvent<HTMLLIElement>
              | React.MouseEvent<HTMLAnchorElement>
              | React.MouseEvent<HTMLDivElement>
          ) => {
            e.preventDefault();
            window.open("https://docs.min.io/?ref=con", "_blank");
          }}
          disableRipple
          className={`$ ${stateClsName} bottom-menu-item`}
          sx={{
            ...menuItemContainerStyles,
            ...menuItemMiniStyles,
            marginBottom: "3px",
          }}
        >
          <ListItemIcon sx={{ ...menuItemIconStyles }}>
            <DocumentationIcon />
          </ListItemIcon>
          <ListItemText
            primary="Documentation"
            sx={{ ...menuItemTextStyles }}
            className={stateClsName}
          />
        </ListItem>

        <ListItem
          button
          onClick={onLogoutClick}
          disableRipple
          sx={{
            ...menuItemContainerStyles,
            ...menuItemMiniStyles,
            marginBottom: "3px",
          }}
          className={`$ ${stateClsName} bottom-menu-item`}
        >
          <ListItemIcon
            sx={{
              ...menuItemIconStyles,
            }}
          >
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{ ...menuItemTextStyles }}
            className={stateClsName}
          />
        </ListItem>
      </List>
    </Box>
  );
};
export default ConsoleMenuList;
