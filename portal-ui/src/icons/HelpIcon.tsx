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

const HelpIcon = (props: SVGProps<SVGSVGElement>) => (
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
        data-name="Uni\xF3n 30"
        d="M.002 128.002a128 128 0 0 1 128-128 128 128 0 0 1 128 128 128 128 0 0 1-128 128 127.993 127.993 0 0 1-128-128Zm25 0a103.115 103.115 0 0 0 103 103 103.116 103.116 0 0 0 103-103 103.117 103.117 0 0 0-103-103A103.116 103.116 0 0 0 25 128.002Zm75.211 58.614c0-10.971 9.48-20.238 20.342-20.238a20.541 20.541 0 0 1 20.133 20.133c0 10.966-9.377 20.447-20.133 20.447-10.864 0-20.344-9.481-20.344-20.342Zm7.457-33.227v-36.213h10.223c20.557 0 31.633-6.495 31.633-18.956 0-11.5-10.971-17.675-31.312-17.675-5.748 0-11.715.423-16.186.846l-2.023-28.008a165.912 165.912 0 0 1 21.508-1.386c37.17 0 58.684 17.147 58.684 44.094 0 24.6-16.4 40.365-46.008 45.051l-.852 12.247Z"
      />
      <path data-name="Rect\xE1ngulo 917" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default HelpIcon;
