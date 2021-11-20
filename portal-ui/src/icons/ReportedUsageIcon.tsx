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

const ReportedUsageIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g data-name="Reported Usage" clipPath="url(#prefix__a)">
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        data-name="Trazado 390"
        d="M128.003 0a128.151 128.151 0 0 0-128 128c0 70.573 57.424 127.995 128 127.995a128.147 128.147 0 0 0 128-127.995 128.15 128.15 0 0 0-128-128Zm0 223.078a95.188 95.188 0 0 1-95.085-95.075 95.191 95.191 0 0 1 95.085-95.084v95.084h95.075a95.184 95.184 0 0 1-95.075 95.074Z"
      />
      <path data-name="Rect\xE1ngulo 869" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default ReportedUsageIcon;
