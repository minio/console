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

const AddFolderIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g data-name="Add Folder" clipPath="url(#prefix__a)">
      <path fill="none" d="M0 0h256v256H0z" />
      <g data-name="add folder-icn">
        <path
          data-name="Uni\xF3n 11"
          d="M39.666 233.405A29.865 29.865 0 0 1 9.8 204.786L.074 97.965A20.666 20.666 0 0 1 0 96.155a29.835 29.835 0 0 1 20.248-28.183V54.5a20.051 20.051 0 0 1-.236-3.083A29.515 29.515 0 0 1 49.549 22h52.166c13.4 0 21.111 10.416 26.211 17.3.338.458.727.981 1.119 1.513h81.508a29.514 29.514 0 0 1 29.531 29.034A29.779 29.779 0 0 1 256 96.155c0 .619-.031 1.234-.092 1.853l-9.963 106.8a29.87 29.87 0 0 1-29.865 28.593ZM20.092 96.155l9.787 107.485a9.8 9.8 0 0 0 9.787 9.749H216.08a9.8 9.8 0 0 0 9.8-9.749l10.03-107.485a9.809 9.809 0 0 0-9.8-9.753H29.879a9.8 9.8 0 0 0-9.787 9.753Zm20.015-44.734h.227v23.514H219.99v-4.7a9.449 9.449 0 0 0-9.437-9.4H122.5c-7.082 0-14.17-18.814-20.783-18.814H49.549a9.449 9.449 0 0 0-9.442 9.4Zm80.588 128.7v-23.339H97.264a7.783 7.783 0 1 1 0-15.565H120.7v-23.335a7.809 7.809 0 0 1 15.617 0v23.335h23.432a7.783 7.783 0 1 1 0 15.565h-23.436v23.335a7.809 7.809 0 0 1-15.617 0Z"
          stroke="rgba(0,0,0,0)"
          strokeMiterlimit={10}
        />
      </g>
      <path data-name="Rect\xE1ngulo 873" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default AddFolderIcon;
