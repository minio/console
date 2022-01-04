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
import MenuItem from "./MenuItem";
import { Box } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import LogoutIcon from "../../../icons/LogoutIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import { IMenuItem } from "./types";
import {
  menuItemContainerStyles,
  menuItemIconStyles,
  menuItemTextStyles,
} from "./MenuStyleUtils";

const MenuList = ({
  menuItems,
  onLogoutClick,
  isOpen,
}: {
  menuItems: IMenuItem[];
  isOpen: boolean;
  onLogoutClick: () => void;
}) => {
  const stateClsName = isOpen ? "wide" : "mini";

  return (
    <Box
      className={`${stateClsName}`}
      sx={{
        display: "flex",
        flexFlow: "column",
        justifyContent: "space-between",
        height: "100%",
        flex: 1,
        marginLeft: "26px",
        marginTop: "35px",
        paddingRight: "8px",

        "&.mini": {
          marginLeft: "18px",
          marginTop: "10px",
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
        }}
      >
        <React.Fragment>
          {(menuItems || []).map((page: IMenuItem) => {
            switch (page.type) {
              case "item": {
                return (
                  <MenuItem
                    stateClsName={stateClsName}
                    page={page}
                    key={page.to}
                  />
                );
              }
              default:
                return null;
            }
          })}
        </React.Fragment>
      </List>
      <List
        sx={{
          paddingTop: 0,
        }}
      >
        <ListItem
          button
          onClick={onLogoutClick}
          disableRipple
          sx={{ ...menuItemContainerStyles }}
        >
          <ListItemIcon sx={{ ...menuItemIconStyles }}>
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

export default MenuList;
