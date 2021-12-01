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

const PermissionIcon = (props: SVGProps<SVGSVGElement>) => (
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
        data-name="Uni\xF3n 36"
        d="m203.074 254.064-74.746-44.835-74.746 44.835a13.592 13.592 0 0 1-20.586-11.636V46.276A46.324 46.324 0 0 1 79.277 0h98.078a46.328 46.328 0 0 1 46.281 46.276v196.152a13.576 13.576 0 0 1-20.562 11.636Zm-67.778-72.319 61.176 36.71V46.276a19.133 19.133 0 0 0-19.113-19.133H79.277a19.148 19.148 0 0 0-19.113 19.133v172.179l61.16-36.71a13.569 13.569 0 0 1 13.969 0Z"
      />
      <path data-name="Rect\xE1ngulo 921" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default PermissionIcon;
