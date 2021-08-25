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

const DashboardIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.863 11.862">
        <g stroke="#000" strokeWidth={0.1}>
          <path
            data-name="Trazado 317"
            d="M11.019.05H.844A.8.8 0 00.05.844v10.174a.8.8 0 00.794.794h10.175a.8.8 0 00.794-.794V.845a.8.8 0 00-.794-.795zm-.032 10.25a.686.686 0 01-.686.686H1.563a.686.686 0 01-.686-.686V1.563a.686.686 0 01.686-.686H10.3a.686.686 0 01.686.686z"
          />
          <path
            data-name="Trazado 318"
            d="M4.909 5.308H2.664a.683.683 0 00-.71.651V9.37a.683.683 0 00.71.651h2.245a.683.683 0 00.71-.651V5.959a.683.683 0 00-.71-.651z"
          />
          <path
            data-name="Trazado 319"
            d="M2.664 1.84h2.244a.71.71 0 01.71.71v1.051a.71.71 0 01-.71.71H2.664a.71.71 0 01-.71-.71V2.55a.71.71 0 01.71-.71z"
          />
          <path
            data-name="Trazado 320"
            d="M9.462 1.84H7.217a.683.683 0 00-.71.651v3.411a.683.683 0 00.71.651h2.244a.683.683 0 00.71-.651V2.491a.683.683 0 00-.709-.651z"
          />
          <path
            data-name="Trazado 321"
            d="M7.217 7.551h2.245a.71.71 0 01.71.71v1.051a.71.71 0 01-.71.71H7.217a.71.71 0 01-.71-.71V8.261a.71.71 0 01.71-.71z"
          />
        </g>
      </svg>
    </SvgIcon>
  );
};

export default DashboardIcon;
