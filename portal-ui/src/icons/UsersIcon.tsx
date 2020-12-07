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

import React from "react";
import { SvgIcon } from "@material-ui/core";

const UsersIcon = () => {
  return (
    <SvgIcon>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6.131 10">
        <g transform="translate(193 719.787)">
          <g transform="translate(-193 -719.787)">
            <path
              d="M3,0h.131a3,3,0,0,1,3,3V5a0,0,0,0,1,0,0H0A0,0,0,0,1,0,5V3A3,3,0,0,1,3,0Z"
              transform="translate(0 5)"
            />
            <ellipse
              cx="2.065"
              cy="2"
              rx="2.065"
              ry="2"
              transform="translate(1 0)"
            />
          </g>
        </g>
      </svg>
    </SvgIcon>
  );
};

export default UsersIcon;
