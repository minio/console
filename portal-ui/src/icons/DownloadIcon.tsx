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
import SvgIcon from "@material-ui/core/SvgIcon";
import { IIcon } from "./props";

const DownloadIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14.368 14.146">
        <path
          data-name="Trazado 362"
          d="M0 5.685a.921.921 0 011.842 0v6.618h10.684V5.685a.921.921 0 011.842 0v7.54a.921.921 0 01-.921.921H.921A.922.922 0 010 13.225v-7.54zM8.105.908a.921.921 0 00-1.842 0v7.7L5.22 7.564a.921.921 0 00-1.3 1.3l2.61 2.611a.922.922 0 001.314 0l2.61-2.611a.921.921 0 00-1.3-1.3L8.111 8.608v-7.7z"
        />
      </svg>
    </SvgIcon>
  );
};

export default DownloadIcon;
