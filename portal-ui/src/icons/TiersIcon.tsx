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

const TiersIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <g data-name="TiersIcon">
        <path data-name="Rect\xE1ngulo 848" fill="none" d="M0 0h256v256H0z" />
        <path
          data-name="Trazado 441"
          d="M128.249 0a11.373 11.373 0 0 0-5.583 1.308L5.334 63.851a9.483 9.483 0 0 0 0 17.039l36.187 19.289-36.187 19.288a9.485 9.485 0 0 0 0 17.058l36.187 19.27-36.187 19.288a9.485 9.485 0 0 0 0 17.058l117.331 62.54a11.442 11.442 0 0 0 10.666 0l117.331-62.54a9.485 9.485 0 0 0 0-17.058l-36.187-19.289 36.187-19.27a9.485 9.485 0 0 0 0-17.058l-36.187-19.289 36.187-19.289a9.483 9.483 0 0 0 0-17.039L133.332 1.311A11.349 11.349 0 0 0 128.249 0ZM62.875 111.563l59.791 31.866a11.442 11.442 0 0 0 10.666 0l59.791-31.866 30.876 16.443-96 51.154-96-51.154Zm-.021 55.617 59.812 31.866a11.442 11.442 0 0 0 10.667 0l59.812-31.866 30.854 16.442-96 51.155-96-51.155Z"
        />
      </g>
    </g>
  </svg>
);

export default TiersIcon;
