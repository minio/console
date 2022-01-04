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
import { ListItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import {
  menuItemContainerStyles,
  menuItemIconStyles,
  menuItemTextStyles,
} from "./MenuStyleUtils";

const MenuItem = ({
  page,
  stateClsName = "",
}: {
  page: any;
  stateClsName?: string;
}) => {
  return (
    <ListItem
      key={page.to}
      button
      onClick={page.onClick}
      component={page.component}
      to={page.to}
      disableRipple
      sx={{ ...menuItemContainerStyles }}
    >
      {page.icon && (
        <Tooltip title={`${page.name}`} placement="right">
          <ListItemIcon sx={{ ...menuItemIconStyles }}>
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
    </ListItem>
  );
};

export default MenuItem;
