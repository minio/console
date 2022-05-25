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

const TotalObjectsIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <g data-name="Total Objects" clipPath="url(#prefix__a)">
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        data-name="total-objects-icn"
        d="M-.004 128.002a128.148 128.148 0 0 1 128-128 128.148 128.148 0 0 1 128 128 128.144 128.144 0 0 1-128 128 128.144 128.144 0 0 1-128-128Zm19.844 0a108.275 108.275 0 0 0 108.156 108.155 108.28 108.28 0 0 0 108.16-108.155 108.283 108.283 0 0 0-108.16-108.157A108.278 108.278 0 0 0 19.842 128.002Zm27.555 31.581a37.6 37.6 0 0 1 37.564-37.565 37.608 37.608 0 0 1 37.561 37.565 37.609 37.609 0 0 1-37.561 37.565 37.606 37.606 0 0 1-37.563-37.566Zm108.127 34.939a17.425 17.425 0 0 1-17.408-17.4v-37.7a17.429 17.429 0 0 1 17.408-17.407h37.689a17.429 17.429 0 0 1 17.408 17.407v37.7a17.425 17.425 0 0 1-17.408 17.4Zm-54.881-81.311a13.3 13.3 0 0 1-11.477-6.625 13.3 13.3 0 0 1 0-13.249l26.861-46.521a13.287 13.287 0 0 1 11.477-6.629 13.281 13.281 0 0 1 11.475 6.629l26.861 46.521a13.285 13.285 0 0 1 0 13.249 13.294 13.294 0 0 1-11.479 6.625Z"
        stroke="rgba(0,0,0,0)"
        strokeMiterlimit={10}
      />
      <path data-name="Rect\xE1ngulo 853" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default TotalObjectsIcon;
