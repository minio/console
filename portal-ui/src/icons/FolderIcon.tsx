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

const FolderIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <g data-name="folder-icn{">
        <path d="M101.729 42.952c6.612 0 13.7 18.758 20.78 18.758h88.049a9.441 9.441 0 0 1 9.444 9.379v4.689H40.349V52.33h-.236a9.441 9.441 0 0 1 9.448-9.378h52.168m124.4 44.255a9.778 9.778 0 0 1 9.774 9.725L225.885 204.09a9.788 9.788 0 0 1-9.794 9.716H39.679a9.781 9.781 0 0 1-9.786-9.716l-9.79-107.158a9.781 9.781 0 0 1 9.79-9.725h196.236M101.729 23H49.561a29.469 29.469 0 0 0-29.544 29.33 20.109 20.109 0 0 0 .236 3.063v13.438A29.758 29.758 0 0 0 0 96.931c0 .6.031 1.2.09 1.8l9.723 106.5a29.827 29.827 0 0 0 29.862 28.532h176.412a29.833 29.833 0 0 0 29.862-28.5l9.959-106.484a17.091 17.091 0 0 0 .091-1.847 29.673 29.673 0 0 0-15.911-26.229 29.477 29.477 0 0 0-29.532-28.949h-81.5c-.4-.529-.787-1.05-1.117-1.5-5.1-6.87-12.815-17.248-26.208-17.248Z" />
        <path data-name="Rect\xE1ngulo 874" fill="none" d="M0 0h256v256H0z" />
      </g>
    </g>
  </svg>
);

export default FolderIcon;
