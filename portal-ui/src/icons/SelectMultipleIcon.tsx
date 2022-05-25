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

const SelectMultipleIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g data-name="Select Multiple" clipPath="url(#prefix__a)">
      <path fill="none" d="M0 0h256v256H0z" />
      <path d="M234.667 234.667v-30.486h-30.473v30.485h30.473m-91.43 0v-30.485h-30.473v30.485h30.473m-91.43 0v-30.485H21.333v30.485h30.473m182.861-91.43v-30.472h-30.473v30.473h30.473m-91.43 0v-30.473h-30.473v30.473h30.473m-91.43 0v-30.473H21.333v30.473h30.473m182.861-91.43V21.333h-30.473v30.473h30.473m-91.43 0V21.333h-30.473v30.473h30.473m-91.43 0V21.333H21.333v30.473h30.473M241.779 256h-44.7a14.225 14.225 0 0 1-14.221-14.234v-44.684a14.225 14.225 0 0 1 14.221-14.234h44.7A14.225 14.225 0 0 1 256 197.082v44.685A14.225 14.225 0 0 1 241.779 256Zm-91.43 0h-44.7a14.225 14.225 0 0 1-14.219-14.234v-44.684a14.225 14.225 0 0 1 14.221-14.234h44.7a14.225 14.225 0 0 1 14.221 14.234v44.685A14.225 14.225 0 0 1 150.349 256Zm-91.43 0h-44.7A14.233 14.233 0 0 1 0 241.766v-44.684a14.233 14.233 0 0 1 14.221-14.234h44.7a14.225 14.225 0 0 1 14.221 14.234v44.685A14.225 14.225 0 0 1 58.918 256Zm182.861-91.43h-44.7a14.222 14.222 0 0 1-14.221-14.221v-44.7a14.214 14.214 0 0 1 14.223-14.219h44.7A14.214 14.214 0 0 1 256 105.651v44.7a14.222 14.222 0 0 1-14.221 14.219Zm-91.43 0h-44.7a14.222 14.222 0 0 1-14.22-14.221v-44.7a14.214 14.214 0 0 1 14.221-14.219h44.7a14.214 14.214 0 0 1 14.221 14.221v44.7a14.222 14.222 0 0 1-14.223 14.219Zm-91.43 0h-44.7A14.23 14.23 0 0 1 0 150.349v-44.7A14.222 14.222 0 0 1 14.221 91.43h44.7a14.214 14.214 0 0 1 14.221 14.221v44.7a14.222 14.222 0 0 1-14.224 14.219Zm182.861-91.43h-44.7a14.214 14.214 0 0 1-14.221-14.221v-44.7A14.214 14.214 0 0 1 197.082 0h44.7A14.214 14.214 0 0 1 256 14.221v44.7a14.214 14.214 0 0 1-14.221 14.218Zm-91.43 0h-44.7A14.214 14.214 0 0 1 91.43 58.918v-44.7A14.214 14.214 0 0 1 105.651 0h44.7a14.214 14.214 0 0 1 14.219 14.221v44.7a14.214 14.214 0 0 1-14.221 14.218Zm-91.43 0h-44.7A14.222 14.222 0 0 1 0 58.918v-44.7A14.222 14.222 0 0 1 14.221 0h44.7a14.214 14.214 0 0 1 14.218 14.221v44.7a14.214 14.214 0 0 1-14.221 14.218Z" />
      <path data-name="Rect\xE1ngulo 915" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default SelectMultipleIcon;
