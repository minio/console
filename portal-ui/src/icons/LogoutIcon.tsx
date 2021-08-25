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
import { IIcon } from "./props";
const LogoutIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.461 12.636">
        <path
          data-name="Trazado 358"
          d="M7.44 0a.81.81 0 010 1.621H1.62v9.4h5.82a.81.81 0 010 1.62H.81a.81.81 0 01-.81-.81V.81A.811.811 0 01.81 0zM2.777 5.508a.81.81 0 000 1.62h3.918l-.918.917a.81.81 0 001.145 1.146l2.3-2.3a.81.81 0 000-1.155l-2.3-2.3a.81.81 0 00-1.145 1.145l.918.918z"
        />
      </svg>
    </SvgIcon>
  );
};

export default LogoutIcon;
