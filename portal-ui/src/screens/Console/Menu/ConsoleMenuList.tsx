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
import MenuItem from "./MenuItem";
import { useLocation } from "react-router-dom";

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
  let selectedMenuGroup = pathname.slice(1, pathname.length); //single path
  if (selectedMenuGroup.indexOf("/") !== -1) {
    selectedMenuGroup = selectedMenuGroup.slice(
      0,
      selectedMenuGroup.indexOf("/")
    ); //nested path
  }

  const [openGroup, setOpenGroup] = useState<string>(selectedMenuGroup);

  const [expandedGroup, setExpandedGroup] = useState<string>(selectedMenuGroup);

  useEffect(() => {
    //in case of redirects.
    setOpenGroup(selectedMenuGroup);
  }, [selectedMenuGroup]);

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
                  selectedMenuGroup={openGroup}
                  setSelectedMenuGroup={setOpenGroup}
                  pathValue={pathname}
                  onExpand={setExpandedGroup}
                  expandedGroup={expandedGroup}
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
