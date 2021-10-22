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

import * as React from "react";
import { SvgIcon, SvgIconProps } from "@mui/material";

const TrashIcon = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <defs>
          <clipPath id="prefix__a">
            <path d="M0 0h256v256H0z" />
          </clipPath>
        </defs>
        <g clipPath="url(#prefix__a)">
          <path
            data-name="Trazado 359"
            d="M222.078 14.266h-50.793V6.25a6.248 6.248 0 00-6.25-6.25H91.93a6.248 6.248 0 00-6.25 6.25v8.016H34.887a6.28 6.28 0 00-6.277 6.277v15.982a6.278 6.278 0 006.277 6.275h187.191a6.278 6.278 0 006.277-6.275V20.543a6.28 6.28 0 00-6.277-6.277z"
          />
          <path
            data-name="Trazado 360"
            d="M42.876 227.97a28.933 28.933 0 0028.844 28.848h113.516a28.934 28.934 0 0028.848-28.848V57.07H42.876z"
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default TrashIcon;
