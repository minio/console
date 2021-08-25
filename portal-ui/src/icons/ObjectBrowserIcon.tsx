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
const ObjectBrowserIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.502 13.542">
        <circle
          data-name="Elipse 55"
          cx={1.667}
          cy={1.667}
          r={1.667}
          transform="rotate(-10.901 40.65 -25.855)"
        />
        <rect
          data-name="Rect\xE1ngulo 797"
          width={3.561}
          height={3.019}
          rx={1.51}
          transform="translate(2.105 3.699)"
        />
        <path
          data-name="Trazado 322"
          d="M4.076 8.73a.352.352 0 00-.609 0L2.15 11.012a.352.352 0 00.3.527h2.635a.352.352 0 00.3-.527z"
        />
        <path
          data-name="Trazado 323"
          d="M11.479 4.083a22.083 22.083 0 00-.027-2.536 1.472 1.472 0 00-.943-1.371 2.294 2.294 0 00-.266-.077A5.586 5.586 0 009.18.004c-.62-.018-1.24.019-1.86.017C6.077.016 4.834.038 3.591.043H.911a.913.913 0 00-.912.912v11.674a.913.913 0 00.912.912h9.656a.912.912 0 00.912-.912V6.813c.001-.909-.022-1.822 0-2.73zm-1.107 7.722a.788.788 0 01-.787.788H1.736a.787.787 0 01-.787-.788V1.78a.787.787 0 01.787-.788h5.266v1.347a2 2 0 002 2h1.373zm0-8.339H8.999a1.128 1.128 0 01-1.126-1.127V.992h1.712a.788.788 0 01.787.788z"
        />
      </svg>
    </SvgIcon>
  );
};

export default ObjectBrowserIcon;
