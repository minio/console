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

const CopyIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <path
        data-name="Trazado 6972"
        d="M215.641 255.9H87.69a22.585 22.585 0 0 1-16.605-6.812 22.542 22.542 0 0 1-6.8-16.6v-162.8a21.969 21.969 0 0 1 6.807-16.058 22.654 22.654 0 0 1 16.6-6.807h127.951a21.95 21.95 0 0 1 16.059 6.807 22.014 22.014 0 0 1 6.813 16.058v162.8a22.6 22.6 0 0 1-6.812 16.613 21.94 21.94 0 0 1-16.037 6.8ZM87.69 232.486h127.951v-162.8H87.69ZM18 189V12A12 12 0 0 1 30 0h139a12 12 0 0 1 12 12 12 12 0 0 1-12 12H42v165a12 12 0 0 1-11.992 12A12 12 0 0 1 18 189Z"
      />
      <path data-name="Rect\xE1ngulo 918" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default CopyIcon;
