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

const LockIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <path data-name="Rect\xE1ngulo 856" fill="none" d="M0 0h256v256H0z" />
      <path
        data-name="Trazado 406"
        d="M210.861 74.863h-28.736V48.236C182.125 21.636 157.844 0 128 0S73.875 21.638 73.875 48.236v26.627H45.139C20.25 74.863.001 92.971.001 115.23v84.8c0 21.912 19.623 39.8 43.979 40.353l84.021 14.62 84.021-14.62c24.356-.551 43.979-18.441 43.979-40.353v-84.8c-.001-22.259-20.25-40.367-45.14-40.367ZM96.296 48.236c0-15.579 14.222-28.254 31.7-28.254s31.7 12.675 31.7 28.254v26.627H96.289Zm137.281 151.79c0 11.24-10.191 20.385-22.717 20.385h-1.084l-81.777 14.229-81.777-14.229h-1.084c-12.526 0-22.716-9.145-22.716-20.385v-84.8c0-11.24 10.19-20.385 22.716-20.385h165.723c12.526 0 22.717 9.145 22.717 20.385Z"
      />
      <path
        data-name="Trazado 407"
        d="M127.707 139.723a19.085 19.085 0 0 0-19.085 19.086 19.066 19.066 0 0 0 8.4 15.818v15.377a10.1 10.1 0 0 0 10.073 10.073h1.218a10.1 10.1 0 0 0 10.073-10.073v-15.377a19.067 19.067 0 0 0 8.4-15.818 19.086 19.086 0 0 0-19.079-19.086Z"
      />
    </g>
  </svg>
);

export default LockIcon;
