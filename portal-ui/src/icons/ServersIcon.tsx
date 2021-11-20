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

const ServersIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <defs>
      <clipPath id="prefix__a">
        <path d="M0 0h256v256H0z" />
      </clipPath>
    </defs>
    <g clipPath="url(#prefix__a)">
      <path fill="none" d="M0 0h256v256H0z" />
      <g data-name="servers-icn">
        <path
          data-name="Trazado 404"
          d="M128 0C64.408 0 0 15.267 0 44.414v167.17c0 29.147 64.408 44.415 128 44.415s128-15.268 128-44.415V44.414C256 15.267 191.592 0 128 0Zm105.743 211.584c0 8.945-37.324 25.909-105.739 25.909s-105.74-17.118-105.74-25.909v-58.911c24.116 11.967 65.15 18.2 105.74 18.2s81.623-6.169 105.739-18.29Zm0-85.128c0 8.791-37.324 25.908-105.739 25.908s-105.74-17.118-105.74-25.908V70.537c24.116 12.06 65.15 18.29 105.74 18.29s81.623-6.168 105.739-18.29ZM128.004 70.321c-68.416 0-105.74-17.118-105.74-25.908s37.324-25.908 105.74-25.908 105.739 17.119 105.739 25.909S196.415 70.323 128 70.323Z"
        />
        <circle
          data-name="Elipse 59"
          cx={15.793}
          cy={15.793}
          r={15.793}
          transform="rotate(-31.72 348.405 44.732)"
        />
        <circle
          data-name="Elipse 60"
          cx={15.793}
          cy={15.793}
          r={15.793}
          transform="rotate(-31.72 207.061 4.576)"
        />
      </g>
      <path data-name="Rect\xE1ngulo 854" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default ServersIcon;
