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

const FolderIcon = (props: SVGProps<SVGSVGElement>) => {
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
        <path d="M102.027 42.952c6.566 0 13.6 18.758 20.637 18.758h87.441a9.408 9.408 0 019.379 9.379v4.689H41.07V52.33h-.234a9.409 9.409 0 019.383-9.378h51.809m123.539 44.255a9.744 9.744 0 019.707 9.725l-9.949 107.158a9.754 9.754 0 01-9.727 9.716h-175.2a9.747 9.747 0 01-9.719-9.716L20.956 96.932a9.747 9.747 0 019.723-9.725h194.883M102.023 23H50.214a29.366 29.366 0 00-29.34 29.33 20.266 20.266 0 00.234 3.063v13.438a29.741 29.741 0 00-20.113 28.1c0 .6.031 1.2.09 1.8l9.656 106.5a29.714 29.714 0 0029.656 28.532h175.2a29.72 29.72 0 0029.656-28.5l9.891-106.484a17.216 17.216 0 00.09-1.847 29.7 29.7 0 00-15.8-26.229 29.371 29.371 0 00-29.328-28.949h-80.941c-.395-.529-.781-1.05-1.109-1.5-5.066-6.87-12.727-17.248-26.027-17.248z" />
      </g>
    </svg>
  );
};

export default FolderIcon;
