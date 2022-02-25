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

const AlertCloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    width="11"
    height="11"
    viewBox="0 0 256 256"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-alert-close-icon">
        <rect
          id="Rectángulo_1612"
          data-name="Rectángulo 1612"
          width="256"
          height="256"
          fill="none"
        />
      </clipPath>
      <clipPath id="clip-path-2-alert-close-icon">
        <rect
          id="Rectángulo_1611"
          data-name="Rectángulo 1611"
          width="256"
          height="256"
        />
      </clipPath>
    </defs>
    <g id="AlertCloseIcon" clipPath="url(#clip-path-alert-close-icon)">
      <g id="AlertCloseIcon-2" data-name="AlertCloseIcon">
        <g
          id="Grupo_2527"
          data-name="Grupo 2527"
          clipPath="url(#clip-path-2-alert-close-icon)"
        >
          <path
            id="Trazado_7276"
            data-name="Trazado 7276"
            d="M230.082,256.006a25.853,25.853,0,0,1-18.328-7.6l-83.761-83.735L44.259,248.41A25.92,25.92,0,0,1,7.6,211.754l83.735-83.735L7.6,44.259A25.92,25.92,0,0,1,44.259,7.6l83.735,83.735L211.754,7.6A25.92,25.92,0,0,1,248.41,44.259l-83.735,83.761,83.735,83.735a25.924,25.924,0,0,1-18.328,44.252"
            transform="translate(-0.006 -0.006)"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default AlertCloseIcon;
