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

const StorageIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <path data-name="Rect\xE1ngulo 864" fill="none" d="M0 0h256v255.259H0z" />
      <path
        data-name="Trazado 396"
        d="M241.464 0H14.521A14.433 14.433 0 0 0 .001 14.3v51.963a14.433 14.433 0 0 0 14.52 14.3h226.943A14.437 14.437 0 0 0 256 66.263V14.3A14.437 14.437 0 0 0 241.464 0Zm.285 66.263a.283.283 0 0 1-.285.28l-227.224-.28.281-52.241 227.229.278Z"
        stroke="#000"
      />
      <path
        data-name="Trazado 397"
        d="M241.464 87.715H14.521a14.431 14.431 0 0 0-14.52 14.3v51.959a14.432 14.432 0 0 0 14.52 14.3h226.943a14.436 14.436 0 0 0 14.536-14.3v-51.959a14.435 14.435 0 0 0-14.536-14.3Zm.285 66.259a.281.281 0 0 1-.285.28l-227.224-.28.281-52.241 227.229.282Z"
        stroke="#000"
      />
      <path
        data-name="Trazado 398"
        d="M241.464 175.427H14.521a14.441 14.441 0 0 0-14.52 14.31v51.959a14.434 14.434 0 0 0 14.52 14.3h226.943a14.437 14.437 0 0 0 14.536-14.3v-51.959a14.445 14.445 0 0 0-14.536-14.31Zm.285 66.269a.279.279 0 0 1-.285.281l-227.224-.281.281-52.245 227.229.286Z"
        stroke="#000"
      />
      <rect
        data-name="Rect\xE1ngulo 813"
        width={23.651}
        height={15.695}
        rx={0.643}
        transform="translate(20.301 21.991)"
        stroke="#000"
        strokeWidth={0.5}
      />
      <rect
        data-name="Rect\xE1ngulo 814"
        width={23.651}
        height={15.695}
        rx={0.643}
        transform="translate(20.301 111.056)"
        stroke="#000"
        strokeWidth={0.5}
      />
      <rect
        data-name="Rect\xE1ngulo 815"
        width={23.651}
        height={15.695}
        rx={0.643}
        transform="translate(20.301 200.016)"
        stroke="#000"
        strokeWidth={0.5}
      />
    </g>
  </svg>
);

export default StorageIcon;
