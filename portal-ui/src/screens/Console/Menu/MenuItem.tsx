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
import {
  Collapse,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import {
  menuItemContainerStyles,
  menuItemIconStyles,
  menuItemMiniStyles,
  menuItemStyle,
  menuItemTextStyles,
} from "./MenuStyleUtils";
import List from "@mui/material/List";
import {
  MenuCollapsedIcon,
  MenuExpandedIcon,
} from "../../../icons/SidebarMenus/MenuIcons";
import { hasPermission } from "../../../common/SecureComponent/SecureComponent";
import {
  CONSOLE_UI_RESOURCE,
  IAM_PAGES_PERMISSIONS,
} from "../../../common/SecureComponent/permissions";

const MenuItem = ({
  page,
  stateClsName = "",
  onExpand,
  selectedMenuGroup,
  pathValue = "",
  expandedGroup = "",
  setSelectedMenuGroup,
  id = `${Math.random()}`,
}: {
  page: any;
  stateClsName?: string;
  onExpand?: (id: any) => void;
  selectedMenuGroup?: any;
  pathValue?: string;
  expandedGroup?: string;
  setSelectedMenuGroup?: (value: string) => void;
  id?: string;
}) => {
  const childrenMenuList = page?.children?.filter(
    (item: any) =>
      ((item.customPermissionFnc
        ? item.customPermissionFnc()
        : hasPermission(CONSOLE_UI_RESOURCE, IAM_PAGES_PERMISSIONS[item.to])) ||
        item.forceDisplay) &&
      !item.fsHidden
  );

  let hasChildren = childrenMenuList?.length;

  const expandCollapseHandler = (e: any) => {
    e.preventDefault();
    if (page.id === selectedMenuGroup && selectedMenuGroup === expandedGroup) {
      onExpand && onExpand(null);
    } else if (page.id === selectedMenuGroup) {
      onExpand && onExpand(selectedMenuGroup);
    } else {
      onExpand && onExpand(page.id);
    }
  };

  const onClickHandler = hasChildren ? expandCollapseHandler : page.onClick;

  const activeClsName =
    pathValue.includes(selectedMenuGroup) && page.id === selectedMenuGroup
      ? "active"
      : "";

  const isActiveGroup =
    selectedMenuGroup === page.id || expandedGroup === page.id;
  return (
    <React.Fragment>
      <ListItem
        key={page.to}
        button
        onClick={(e: any) => {
          onExpand && onExpand(null);
          onClickHandler && onClickHandler(e);
          setSelectedMenuGroup && setSelectedMenuGroup(selectedMenuGroup);
        }}
        component={page.component}
        to={page.to}
        id={id}
        className={`${activeClsName} ${stateClsName} main-menu-item `}
        disableRipple
        sx={{
          ...menuItemContainerStyles,
          marginTop: "5px",
          ...menuItemMiniStyles,

          "& .expanded-icon": {
            border: "1px solid #35393c",
          },
        }}
      >
        {page.icon && (
          <Tooltip title={`${page.name}`} placement="right">
            <ListItemIcon
              sx={{ ...menuItemIconStyles }}
              className={`${
                isActiveGroup && hasChildren ? "expanded-icon" : ""
              }`}
            >
              <Suspense fallback={<div>...</div>}>
                <page.icon />
              </Suspense>
            </ListItemIcon>
          </Tooltip>
        )}
        {page.name && (
          <ListItemText
            className={stateClsName}
            sx={{ ...menuItemTextStyles }}
            primary={page.name}
          />
        )}

        {hasChildren ? (
          isActiveGroup ? (
            <MenuCollapsedIcon height={15} width={15} className="group-icon" />
          ) : (
            <MenuExpandedIcon height={15} width={15} className="group-icon" />
          )
        ) : null}
      </ListItem>

      {hasChildren ? (
        <Collapse
          key={page.id}
          id={`${page.id}-children`}
          in={expandedGroup === page.id}
          timeout="auto"
          unmountOnExit
        >
          <List
            component="div"
            disablePadding
            key={page.id}
            sx={{
              marginLeft: "15px",
              "&.mini": {
                marginLeft: "0px",
              },
            }}
            className={`${stateClsName}`}
          >
            {childrenMenuList.map((item: any) => {
              return (
                <ListItem
                  key={item.to}
                  button
                  component={item.component}
                  to={item.to}
                  disableRipple
                  sx={{
                    ...menuItemStyle,
                    ...menuItemMiniStyles,
                  }}
                  className={`${stateClsName}`}
                >
                  {item.icon && (
                    <Tooltip title={`${item.name}`} placement="right">
                      <ListItemIcon
                        sx={{
                          background: "#00274D",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          "& svg": {
                            fill: "#fff",
                            minWidth: "12px",
                            maxWidth: "12px",
                          },
                        }}
                        className="menu-icon"
                      >
                        <Suspense fallback={<div>...</div>}>
                          <item.icon />
                        </Suspense>
                      </ListItemIcon>
                    </Tooltip>
                  )}
                  {item.name && (
                    <ListItemText
                      className={stateClsName}
                      sx={{ ...menuItemTextStyles, marginLeft: "16px" }}
                      primary={item.name}
                    />
                  )}
                </ListItem>
              );
            })}
          </List>
        </Collapse>
      ) : null}
    </React.Fragment>
  );
};

export default MenuItem;
