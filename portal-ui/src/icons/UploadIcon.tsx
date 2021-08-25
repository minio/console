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
const UploadIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.14 18.671">
        <path
          data-name="Trazado 370"
          d="M0 7.99a1.163 1.163 0 012.326 0v8.355h13.488V7.99a1.163 1.163 0 012.326 0v9.518a1.163 1.163 0 01-1.163 1.163H1.163A1.163 1.163 0 010 17.508V7.99zm7.907 5.7a1.163 1.163 0 002.326 0V3.972l1.318 1.318a1.163 1.163 0 001.645-1.644l-3.3-3.3a1.163 1.163 0 00-1.658 0l-3.3 3.3A1.163 1.163 0 006.583 5.29L7.9 3.972v9.718z"
        />
      </svg>
    </SvgIcon>
  );
};

export default UploadIcon;
