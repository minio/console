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

const DiagnosticIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 0h256v256H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)">
        <path
          d="M244.838 117.683a10.454 10.454 0 00-10.453 10.462 106.36 106.36 0 01-106.238 106.229 106.335 106.335 0 01-106.219-106.23 106.368 106.368 0 0195.766-105.717v31.075a75.511 75.511 0 00-65.008 74.643 75.557 75.557 0 0075.461 75.469 75.559 75.559 0 0075.469-75.469 75.518 75.518 0 00-64.992-74.643v-52.5h-10.477A127.289 127.289 0 00.999 128.148a127.291 127.291 0 00127.148 127.153 127.293 127.293 0 00127.156-127.156 10.466 10.466 0 00-10.465-10.462zm-62.156 10.462a54.6 54.6 0 01-54.539 54.544 54.62 54.62 0 01-54.547-54.544 54.607 54.607 0 0144.094-53.476v30.374a25.355 25.355 0 00-14.953 23.1 25.407 25.407 0 0025.406 25.415 25.409 25.409 0 0025.414-25.415 25.379 25.379 0 00-14.937-23.1V74.674a54.6 54.6 0 0144.066 53.471z"
          stroke="#000"
          strokeWidth={0.1}
        />
      </g>
    </svg>
  );
};

export default DiagnosticIcon;
