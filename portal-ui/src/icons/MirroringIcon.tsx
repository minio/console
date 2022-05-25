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

const MirroringIcon = (props: SVGProps<SVGSVGElement>) => (
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
        data-name="Uni\xF3n 39"
        d="M119.5 246.769v-19a9 9 0 0 1 9-9 9 9 0 0 1 9 9v19a9 9 0 0 1-9 9 9.006 9.006 0 0 1-9-9Zm0-43.852v-19a9.006 9.006 0 0 1 9-9 9 9 0 0 1 9 9v19a9 9 0 0 1-9 9 9.006 9.006 0 0 1-9-9Zm117.967-22.283-71.154-41.4a12.875 12.875 0 0 1-6.463-11.237 12.889 12.889 0 0 1 6.463-11.237l71.154-41.394A13 13 0 0 1 257 86.6v82.794a13.018 13.018 0 0 1-13.021 13.02 12.877 12.877 0 0 1-6.514-1.78Zm-54.674-52.636 56.211 32.7v-65.4ZM0 169.4V86.6a13 13 0 0 1 19.535-11.237l71.15 41.394a12.879 12.879 0 0 1 6.461 11.237 12.865 12.865 0 0 1-6.461 11.237l-71.15 41.4a12.9 12.9 0 0 1-6.518 1.783A13.015 13.015 0 0 1 0 169.4Zm18-8.7L74.205 128 18 95.3Zm101.5-1.636v-19a9 9 0 0 1 9-9 9 9 0 0 1 9 9v19a9 9 0 0 1-9 9 9 9 0 0 1-9-8.998Zm0-43.857v-19a9.006 9.006 0 0 1 9-9 9 9 0 0 1 9 9v19a9 9 0 0 1-9 9 9.006 9.006 0 0 1-9-8.999Zm0-43.852v-19a9 9 0 0 1 9-9 9 9 0 0 1 9 9v19a9 9 0 0 1-9 9 9 9 0 0 1-9-8.998Zm0-43.857v-19a9.006 9.006 0 0 1 9-9 9 9 0 0 1 9 9v19a9 9 0 0 1-9 9 9.006 9.006 0 0 1-9-8.998Z"
      />
      <path data-name="Rect\xE1ngulo 923" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default MirroringIcon;
