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

const SupportMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 13.264 16"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-support-menu-icon">
        <rect
          id="Rectángulo_1590"
          data-name="Rectángulo 1590"
          width="13.264"
          height="16"
          fill="#8399ab"
        />
      </clipPath>
    </defs>
    <g
      id="Grupo_2451"
      data-name="Grupo 2451"
      clipPath="url(#clip-path-support-menu-icon)"
    >
      <path
        id="Trazado_7107"
        data-name="Trazado 7107"
        d="M141.4,175.257a1.765,1.765,0,1,0,1.765-1.763,1.758,1.758,0,0,0-1.765,1.763"
        transform="translate(-136.66 -167.676)"
        fill="#8399ab"
      />
      <path
        id="Trazado_7108"
        data-name="Trazado 7108"
        d="M13.256,11.233l-.791-3.756.064-1.906a.373.373,0,0,0,0-.052A6.285,6.285,0,0,0,9.25.642h0L9.185.608c-.153-.08-.31-.155-.471-.223a.375.375,0,0,0-.13-.031A7.2,7.2,0,0,0,7.731.106v5.28a2.51,2.51,0,0,1,.343,4.16l.876,1.516a.376.376,0,0,1-.275.564.373.373,0,0,1-.147-.01.376.376,0,0,1-.228-.178L7.424,9.923A2.514,2.514,0,0,1,5.282,5.385V0a6.15,6.15,0,0,0-1.141.28A.377.377,0,0,0,4.065.3q-.231.087-.453.192A6.281,6.281,0,0,0,1.869,10.647l-.5,3.2a.376.376,0,0,0,.152.363.379.379,0,0,0,.124.058l6.6,1.722a.376.376,0,0,0,.467-.315l.283-2.165,1.738.4a.376.376,0,0,0,.454-.306l.313-1.912h1.39a.376.376,0,0,0,.368-.453"
        transform="translate(0 0.001)"
        fill="#8399ab"
      />
    </g>
  </svg>
);

export default SupportMenuIcon;
