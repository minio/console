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

const FileImageIcon = (props: SVGProps<SVGSVGElement>) => (
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
        data-name="Trazado 422"
        d="M236.186 77.259c.389-15.768.96-32.27-.5-47.984-1.1-11.766-6.2-21.754-17.847-25.937a42.726 42.726 0 0 0-5.02-1.449c-6.556-1.479-13.445-1.6-20.108-1.8-11.737-.344-23.47.366-35.207.314-23.515-.1-47.027.324-70.541.415q-4.232.017-8.464.017H36.256A17.275 17.275 0 0 0 19 18.091v220.875a17.2 17.2 0 0 0 5.19 12.315v.033h.037a17.19 17.19 0 0 0 12.026 4.906h182.7a17.275 17.275 0 0 0 17.256-17.256V128.928c.002-17.198-.444-34.49-.023-51.669Zm-68.228-58.476h32.387a14.9 14.9 0 0 1 14.9 14.9v31.9h-25.974a21.339 21.339 0 0 1-21.313-21.315Zm-116.114 0h99.637v25.481a37.835 37.835 0 0 0 37.79 37.792h25.974v94.9l-15.227-26.374a28.352 28.352 0 0 0-24.8-14.32 28.387 28.387 0 0 0-24.85 14.4l-10.021 17.81-27.633-47.861a28.351 28.351 0 0 0-24.8-14.319 28.389 28.389 0 0 0-24.849 14.4l-26.117 46.422V33.689a14.9 14.9 0 0 1 14.9-14.9Zm-9.864 215.74a14.9 14.9 0 0 1-1.691-1.746l-1.562-34.31 39.036-69.391a11.6 11.6 0 0 1 10.146-5.857 11.6 11.6 0 0 1 10.146 5.857L159.442 235.4Zm158.364 3.754h-19.7l-30.466-52.769 14.889-26.465a11.6 11.6 0 0 1 10.146-5.858 11.6 11.6 0 0 1 10.146 5.858l29.884 51.762v12.57a14.9 14.9 0 0 1-14.9 14.9Z"
      />
      <path
        data-name="Trazado 423"
        d="M88.377 96.213a33.38 33.38 0 0 0 33.343-33.344 33.381 33.381 0 0 0-33.343-33.344 33.38 33.38 0 0 0-33.344 33.344 33.381 33.381 0 0 0 33.344 33.344Zm0-49.763a16.438 16.438 0 0 1 16.418 16.419 16.438 16.438 0 0 1-16.418 16.419 16.438 16.438 0 0 1-16.419-16.419A16.437 16.437 0 0 1 88.377 46.45Z"
      />
      <path data-name="Rect\xE1ngulo 903" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default FileImageIcon;
