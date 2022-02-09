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

const LogsMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 12 12"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-logs-menu">
        <rect
          id="Rectángulo_982"
          data-name="Rectángulo 982"
          width="12"
          height="12"
          transform="translate(0 0)"
        />
      </clipPath>
    </defs>
    <g id="logs-icon" transform="translate(-0.245 0.078)">
      <g
        id="Grupo_2346"
        data-name="Grupo 2346"
        transform="translate(0.245 -0.078)"
        clipPath="url(#clip-path-logs-menu)"
      >
        <path
          id="Trazado_7070"
          data-name="Trazado 7070"
          d="M.1,86.274v7.138a.806.806,0,0,0,.805.8H11.273a.806.806,0,0,0,.805-.8V86.274Zm4.482,1.274v.764a.324.324,0,0,1-.318.331H1.358a.325.325,0,0,1-.319-.331v-.764a.325.325,0,0,1,.319-.33H4.264a.324.324,0,0,1,.318.33Z"
          transform="translate(-0.135 -82.221)"
        />
        <path
          id="Trazado_7071"
          data-name="Trazado 7071"
          d="M11.273.1H.905A.806.806,0,0,0,.1.906v2.34H12.078V.906A.806.806,0,0,0,11.273.1"
          transform="translate(-0.135 -0.084)"
        />
      </g>
    </g>
  </svg>
);

export default LogsMenuIcon;
