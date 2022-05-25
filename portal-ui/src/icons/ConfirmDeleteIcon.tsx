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

const ConfirmDeleteIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={"min-icon"}
    viewBox="0 0 256 256"
    {...props}
  >
    <defs>
      <clipPath id="clip-path">
        <rect
          id="Rectángulo_1030"
          data-name="Rectángulo 1030"
          width="256.722"
          height="256.722"
          fill="none"
        />
      </clipPath>
      <clipPath id="clip-Generic_Delete">
        <rect width="256" height="256" />
      </clipPath>
    </defs>
    <g
      id="Generic_Delete"
      data-name="Generic Delete"
      clipPath="url(#clip-Generic_Delete)"
    >
      <rect width="256" height="256" fill="#fff" />
      <g id="Generic_Delete_Icon" data-name="Generic Delete Icon">
        <g id="Grupo_2418" data-name="Grupo 2418">
          <path
            id="Trazado_7169"
            data-name="Trazado 7169"
            d="M128.362,0a128.361,128.361,0,1,0,128.36,128.361A128.361,128.361,0,0,0,128.362,0m.764,229.776A101.415,101.415,0,1,1,230.541,128.361,101.415,101.415,0,0,1,129.126,229.776"
            fill="#c83b51"
          />
          <path
            id="Trazado_7170"
            data-name="Trazado 7170"
            d="M239.678,162.575l-18.744-19.187a4.572,4.572,0,0,0-6.36,0l-22.136,22.661-22.133-22.661a4.44,4.44,0,0,0-6.356,0L145.2,162.575a4.45,4.45,0,0,0,0,6.211L167.491,191.6,145.2,214.411a4.45,4.45,0,0,0,0,6.211l18.746,19.189a4.571,4.571,0,0,0,6.358,0l22.133-22.661,22.136,22.661a4.442,4.442,0,0,0,6.358,0l18.744-19.189a4.445,4.445,0,0,0,0-6.211L217.392,191.6l22.286-22.814a4.445,4.445,0,0,0,0-6.211"
            transform="translate(-64.082 -63.239)"
            fill="#c83b51"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default ConfirmDeleteIcon;
