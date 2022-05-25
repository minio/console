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

const OpenListIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <g data-name="OpenListIcon">
        <path
          data-name="Trazado 6842"
          d="M0 71.037a14.843 14.843 0 0 1 4.511-10.526 14.978 14.978 0 0 1 21.427 0l101.874 101.874 102.25-101.874a14.978 14.978 0 0 1 21.427 0 14.978 14.978 0 0 1 0 21.427L138.714 194.714a14.843 14.843 0 0 1-10.526 4.511 13.65 13.65 0 0 1-10.526-4.511L4.887 81.938A15.229 15.229 0 0 1 0 71.037Z"
        />
        <path data-name="Rect\xE1ngulo 896" fill="none" d="M0 0h256v256H0z" />
      </g>
    </g>
  </svg>
);

export default OpenListIcon;
