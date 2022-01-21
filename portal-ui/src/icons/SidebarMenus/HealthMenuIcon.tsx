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

const HealthMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 16 13.597"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-health-menu">
        <rect
          id="Rectángulo_1588"
          data-name="Rectángulo 1588"
          width="16"
          height="13.597"
          fill="#8399ab"
        />
      </clipPath>
    </defs>
    <g
      id="Grupo_2444"
      data-name="Grupo 2444"
      clipPath="url(#clip-path-health-menu)"
    >
      <path
        id="Trazado_7105"
        data-name="Trazado 7105"
        d="M271.044,465.92"
        transform="translate(-263.134 -452.323)"
        fill="#8399ab"
      />
      <path
        id="Trazado_7106"
        data-name="Trazado 7106"
        d="M16,4.462A4.35,4.35,0,0,0,11.768,0,4.2,4.2,0,0,0,7.992,2.484,4.2,4.2,0,0,0,4.217,0,4.326,4.326,0,0,0,0,4.462c0,5.9,7.91,9.136,7.91,9.136S16,10.329,16,4.462M10.886,8.084a.653.653,0,0,1-.653.653H9.146V9.824a.653.653,0,0,1-.653.653H7.508a.653.653,0,0,1-.653-.653V8.737H5.768a.653.653,0,0,1-.653-.653V7.1a.653.653,0,0,1,.653-.653H6.855V5.359a.653.653,0,0,1,.653-.653h.986a.653.653,0,0,1,.653.653V6.446h1.087a.653.653,0,0,1,.653.653Z"
        transform="translate(0 0)"
        fill="#8399ab"
      />
    </g>
  </svg>
);

export default HealthMenuIcon;
