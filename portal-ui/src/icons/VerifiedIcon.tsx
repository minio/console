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

const VerifiedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    className={`min-icon`}
    fill={"currentcolor"}
    {...props}
  >
    <defs>
      <clipPath id="registration-icon_svg__a">
        <path data-name="Rect\xE1ngulo 1593" fill="#4ccb92" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
    <g data-name="Grupo 2469" clipPath="url(#registration-icon_svg__a)">
      <path
        data-name="Trazado 7117"
        d="M19.075 11.962a3.1 3.1 0 0 0 1.008-1.965 3.1 3.1 0 0 0-1.008-1.963 3.134 3.134 0 0 1-.633-.894 3.4 3.4 0 0 1 0-1.164 3.121 3.121 0 0 0-.286-2.154 2.856 2.856 0 0 0-1.892-.952 3.024 3.024 0 0 1-1.053-.353 3.232 3.232 0 0 1-.628-.917A2.982 2.982 0 0 0 13.118 0a2.77 2.77 0 0 0-2.029.383 3.079 3.079 0 0 1-1.085.368 3.079 3.079 0 0 1-1.085-.37A2.77 2.77 0 0 0 6.89-.002a2.99 2.99 0 0 0-1.465 1.599 3.236 3.236 0 0 1-.633.922 3.033 3.033 0 0 1-1.05.351 2.856 2.856 0 0 0-1.892.953 3.133 3.133 0 0 0-.284 2.142 3.448 3.448 0 0 1 0 1.164 3.216 3.216 0 0 1-.633.9A3.1 3.1 0 0 0-.075 9.996a3.1 3.1 0 0 0 1.008 1.965 3.246 3.246 0 0 1 .633.89 3.462 3.462 0 0 1 0 1.166 3.133 3.133 0 0 0 .284 2.154 2.856 2.856 0 0 0 1.892.952 3.033 3.033 0 0 1 1.05.351 3.234 3.234 0 0 1 .633.921 2.982 2.982 0 0 0 1.465 1.592 2.77 2.77 0 0 0 2.029-.383 3.076 3.076 0 0 1 1.085-.37 3.077 3.077 0 0 1 1.085.368 3.769 3.769 0 0 0 1.525.472 1.561 1.561 0 0 0 .5-.082 2.978 2.978 0 0 0 1.465-1.6 3.249 3.249 0 0 1 .633-.921 3.032 3.032 0 0 1 1.05-.351 2.856 2.856 0 0 0 1.892-.952 3.113 3.113 0 0 0 .284-2.157 3.445 3.445 0 0 1 0-1.164 3.16 3.16 0 0 1 .633-.889m-10.13 1.894-3.89-4.066 1.38-1.437 2.51 2.618 4.638-4.833 1.38 1.442Z"
        fill="#4ccb92"
      />
    </g>
  </svg>
);

export default VerifiedIcon;
