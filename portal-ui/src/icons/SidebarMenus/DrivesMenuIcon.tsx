// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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
import { SVGProps } from "react";

const DrivesMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 12 12"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-drives-menu-icon">
        <rect
          id="Rectángulo_989"
          data-name="Rectángulo 989"
          width="12"
          height="12"
          fill="#fff"
        />
      </clipPath>
    </defs>
    <g
      id="Grupo_2361"
      data-name="Grupo 2361"
      clipPath="url(#clip-path-drives-menu-icon)"
    >
      <path
        id="Trazado_7083"
        data-name="Trazado 7083"
        d="M6,2.839H6c3.882,0,6-.938,6-1.42S9.882,0,6,0,0,.938,0,1.42s2.118,1.42,6,1.42"
        transform="translate(0)"
        fill="#fff"
      />
      <path
        id="Trazado_7084"
        data-name="Trazado 7084"
        d="M6,135.08a15.409,15.409,0,0,1-6-1v3.228c0,.482,2.118,1.42,6,1.42s6-.93,6-1.42v-3.233a15.245,15.245,0,0,1-6,1m-3.939,2.063a.915.915,0,0,1-1.234-.281.849.849,0,0,1,.291-1.192.915.915,0,0,1,1.234.281.849.849,0,0,1-.291,1.192"
        transform="translate(0 -126.731)"
        fill="#fff"
      />
      <path
        id="Trazado_7085"
        data-name="Trazado 7085"
        d="M6,53.034a15.306,15.306,0,0,1-6-1V55.1c0,.482,2.118,1.42,6,1.42s6-.938,6-1.42V52.032a15.244,15.244,0,0,1-6,1M2.061,55.19a.915.915,0,0,1-1.234-.281.849.849,0,0,1,.291-1.192A.915.915,0,0,1,2.353,54a.849.849,0,0,1-.291,1.192"
        transform="translate(0 -49.181)"
        fill="#fff"
      />
    </g>
  </svg>
);

export default DrivesMenuIcon;
