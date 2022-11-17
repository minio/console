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
import { SVGProps } from "react";

const ObjectPreviewIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={"min-icon"}
    viewBox="0 0 256 256"
    fill={"currentcolor"}
    {...props}
  >
    <defs>
      <clipPath id="clip-path">
        <rect
          id="Rectángulo_1031"
          data-name="Rectángulo 1031"
          width="217"
          height="256.004"
          fill="none"
        />
      </clipPath>
      <clipPath id="clip-Object_Preview">
        <rect width="256" height="256" />
      </clipPath>
    </defs>
    <g
      id="Object_Preview"
      data-name="Object Preview"
      clipPath="url(#clip-Object_Preview)"
    >
      <rect width="256" height="256" fill="#fff" />
      <g id="Object_Preview_Icon" data-name="Object Preview Icon">
        <g id="Grupo_2420" data-name="Grupo 2420" transform="translate(20)">
          <g id="Grupo_2419" data-name="Grupo 2419">
            <path
              id="Trazado_7171"
              data-name="Trazado 7171"
              d="M110.1,110.805A28.093,28.093,0,1,0,138.137,138.9,28.063,28.063,0,0,0,110.1,110.805m-.064,42.209a14.079,14.079,0,1,1,14.05-14.079,14.065,14.065,0,0,1-14.05,14.079"
              transform="translate(-0.168)"
            />
            <path
              id="Trazado_7172"
              data-name="Trazado 7172"
              d="M216.564,77.2c.166-6.9.359-13.945.413-21h-31.1A25.6,25.6,0,0,1,160.334,30.6l0-30.544q-3.775.06-7.553.148c-4.892.108-9.79.228-14.681.208C114.67.31,91.212.733,67.766.824c-2.8.016-5.619.016-8.444.016H17.216A17.241,17.241,0,0,0,0,18.08V238.769A17.238,17.238,0,0,0,17.216,256l182.163,0a17.226,17.226,0,0,0,17.2-17.235V128.815c0-17.186-.424-34.46-.013-51.618m-34.353,71.335a86.569,86.569,0,0,1-144.462,0,17.428,17.428,0,0,1,0-19.27,86.569,86.569,0,0,1,144.462,0,17.435,17.435,0,0,1,0,19.27"
              transform="translate(0)"
            />
            <path
              id="Trazado_7173"
              data-name="Trazado 7173"
              d="M203.277,0H171.758V22.411c-1.233,19.062,12.107,22.137,22.106,22.151h23.489V13.406c0-7.007-7.08-13.4-14.074-13.406"
              transform="translate(-0.351)"
            />
          </g>
        </g>
        <rect
          id="Rectángulo_1032"
          data-name="Rectángulo 1032"
          width="256"
          height="256"
          fill="none"
        />
      </g>
    </g>
  </svg>
);

export default ObjectPreviewIcon;
