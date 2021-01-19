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
import { SvgIcon } from "@material-ui/core";
const LogoutIcon = () => {
  return (
    <SvgIcon>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.122 10.571">
        <g transform="translate(0 0.5)">
          <path
            style={{ fill: "none", stroke: "rgba(255,255,255,0.8)" }}
            d="M4816.27,3755.205v-2.939h8.539v9.571h-8.539v-2.932"
            transform="translate(-4813.187 -3752.266)"
          />
          <path
            style={{ fill: "none", stroke: "rgba(255,255,255,0.8)" }}
            d="M4813.187,3757.052h8.081"
            transform="translate(-4813.187 -3752.266)"
          />
          <path
            style={{ fill: "none", stroke: "rgba(255,255,255,0.8)" }}
            d="M4806.5,3756.511l2.265,2.063-2.265,2.063"
            transform="translate(-4800.808 -3753.863)"
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default LogoutIcon;
