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

const CallHomeFeatureIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 26 25"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-call-home-feature">
        <rect
          id="Rectángulo_1614"
          data-name="Rectángulo 1614"
          width="6.172"
          height="6.309"
          fill="#fff"
          stroke="rgba(0,0,0,0)"
          strokeWidth="1"
        />
      </clipPath>
    </defs>
    <g
      id="Grupo_2540"
      data-name="Grupo 2540"
      transform="translate(0.531 0.596)"
    >
      <path
        id="call-home-icon"
        d="M16.865,8.241a1.7,1.7,0,0,1-1.6,1.092h-.633v5.3a1.694,1.694,0,0,1-1.694,1.694h-8.9a1.7,1.7,0,0,1-1.694-1.694v-5.3H1.71A1.694,1.694,0,0,1,.58,6.362L7.358.432a1.694,1.694,0,0,1,2.259,0L16.4,6.362h0a1.694,1.694,0,0,1,.47,1.879"
        transform="translate(0 0)"
        fill="#07193e"
        stroke="rgba(0,0,0,0)"
        strokeWidth="1"
      />
      <g
        id="Grupo_2539"
        data-name="Grupo 2539"
        transform="translate(5.441 6.68)"
      >
        <g
          id="Grupo_2539-2"
          data-name="Grupo 2539"
          clipPath="url(#clip-path-call-home-feature)"
        >
          <path
            id="Trazado_7262"
            data-name="Trazado 7262"
            d="M4.6,38.068a.164.164,0,0,0-.231,0l-.377.377a.149.149,0,0,1-.21,0L2.254,36.918a.149.149,0,0,1,0-.21l.377-.377a.164.164,0,0,0,0-.231L1.4,34.871a.164.164,0,0,0-.231,0l-.763.763a1.4,1.4,0,0,0,0,1.982l2.669,2.672a1.4,1.4,0,0,0,1.982,0l.763-.763a.164.164,0,0,0,0-.231Z"
            transform="translate(0 -34.389)"
            fill="#fff"
            stroke="rgba(0,0,0,0)"
            strokeWidth="1"
          />
        </g>
      </g>
      <g id="Grupo_2537" data-name="Grupo 2537" transform="translate(12.323 0)">
        <g
          id="Elipse_623"
          data-name="Elipse 623"
          transform="translate(-0.323 -0.249)"
          fill="#4ccb92"
          stroke="#fff"
          strokeWidth="1"
        >
          <circle cx="7" cy="7" r="7" stroke="none" />
          <circle cx="7" cy="7" r="6.5" fill="none" />
        </g>
        <g id="check" transform="translate(2.934 4.069)">
          <path
            id="Trazado_7261"
            data-name="Trazado 7261"
            d="M14.9,10.862a.622.622,0,1,1,.889.871l-3.311,4.139a.622.622,0,0,1-.9.017L9.384,13.694a.622.622,0,1,1,.879-.879L12,14.551l2.881-3.67.017-.018Z"
            transform="translate(-9.182 -10.676)"
            fill="#fff"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default CallHomeFeatureIcon;
