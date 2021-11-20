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

const BucketsIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <path data-name="Rect\xE1ngulo 884" fill="none" d="M0 0h256v256H0z" />
      <path
        data-name="buckets-icn"
        d="m244.998 90.474.049-.243 10.563-61.472a25.8 25.8 0 0 0-4.748-19.986A21.518 21.518 0 0 0 233.739 0H22.255A21.507 21.507 0 0 0 5.138 8.773 25.862 25.862 0 0 0 .384 28.759c5.223 30.384 16.209 94.421 25 145.533l.014.1c4.457 26 8.338 48.644 10.617 61.787 1.965 11.487 11.148 19.819 21.854 19.819h140.264c10.713 0 19.875-8.332 21.861-19.819l10.592-61.711.076-.375Zm-203.928 72.5c-3.6-20.981-7.479-43.648-11.148-65.015H226.09l-11.168 65.015Zm197.482-137.7-9.2 53.735h-202.7c-3.7-21.626-7-40.758-9.221-53.735a5.736 5.736 0 0 1 1.041-4.394 4.738 4.738 0 0 1 3.764-1.934h211.5a4.732 4.732 0 0 1 3.775 1.939 5.691 5.691 0 0 1 1.042 4.387Zm-26.893 156.649-8.709 50.763a5.048 5.048 0 0 1-4.824 4.37H57.862a5.047 5.047 0 0 1-4.816-4.361c-1.93-11.25-5.066-29.464-8.717-50.771Z"
        stroke="#000"
        strokeWidth={0.2}
      />
    </g>
  </svg>
);

export default BucketsIcon;
