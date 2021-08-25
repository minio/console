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
const TenantsOutlinedIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25.07 26.578">
        <path
          data-name="Trazado 395"
          d="M17.805 26.078a3.864 3.864 0 01-3.86-3.861 3.836 3.836 0 01.957-2.541l-3.641-4.727a7.473 7.473 0 01-2.847.693l-.132 2.42a2.054 2.054 0 01.765 1.6 2.053 2.053 0 01-2.05 2.05 2.053 2.053 0 01-2.05-2.05 2.053 2.053 0 011.859-2.042l.112-2.055A7.58 7.58 0 01.5 8.08 7.584 7.584 0 018.075.504a7.585 7.585 0 017.576 7.576 7.59 7.59 0 01-.223 1.822l3.922.57a2.782 2.782 0 012.419-1.4 2.8 2.8 0 012.8 2.8 2.8 2.8 0 01-2.8 2.8 2.8 2.8 0 01-2.8-2.746l-4.059-.589a7.6 7.6 0 01-2.352 2.844l3.527 4.581a3.864 3.864 0 011.716-.4 3.865 3.865 0 013.861 3.86 3.865 3.865 0 01-3.857 3.856zm-6.4-11.731l4.13 5.362-.145.149a3.36 3.36 0 00-.963 2.36 3.385 3.385 0 003.381 3.381 3.385 3.385 0 003.381-3.381 3.385 3.385 0 00-3.381-3.381 3.378 3.378 0 00-1.664.441l-.181.1-4.086-5.3.209-.144a7.107 7.107 0 002.47-2.956l.074-.165 4.844.7-.014.22c0 .074-.007.106-.007.139a2.323 2.323 0 002.321 2.32 2.323 2.323 0 002.321-2.32 2.323 2.323 0 00-2.321-2.321 2.307 2.307 0 00-2.074 1.284l-.078.155-4.8-.7.076-.264a7.133 7.133 0 00.274-1.954 7.1 7.1 0 00-7.1-7.1 7.1 7.1 0 00-7.1 7.1 7.1 7.1 0 006.219 7.04l.223.027-.161 2.95h-.232 0a1.576 1.576 0 00-1.6 1.569 1.572 1.572 0 001.571 1.57 1.572 1.572 0 001.571-1.57 1.574 1.574 0 00-.67-1.286l-.109-.076.17-3.123h.224a7.017 7.017 0 003.042-.735z"
          
        />
      </svg>
    </SvgIcon>
  );
};

export default TenantsOutlinedIcon;
