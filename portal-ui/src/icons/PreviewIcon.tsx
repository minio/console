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

const PreviewIcon = (props: SVGProps<SVGSVGElement>) => (
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
        data-name="Trazado 408"
        d="M251.052 112.324A147.3 147.3 0 0 0 128 46.272 147.3 147.3 0 0 0 4.949 112.324a29.583 29.583 0 0 0 0 32.76A147.3 147.3 0 0 0 128 211.136a147.305 147.305 0 0 0 123.052-66.052 29.585 29.585 0 0 0 0-32.76Zm-17.68 21.08A126.144 126.144 0 0 1 128 189.974a126.144 126.144 0 0 1-105.371-56.57 8.487 8.487 0 0 1 0-9.4A126.144 126.144 0 0 1 128 67.434a126.145 126.145 0 0 1 105.372 56.569 8.488 8.488 0 0 1 0 9.401Z"
      />
      <path
        data-name="Trazado 409"
        d="M128 74.274a54.492 54.492 0 0 0-54.431 54.43A54.492 54.492 0 0 0 128 183.135a54.493 54.493 0 0 0 54.431-54.431A54.493 54.493 0 0 0 128 74.274Zm0 87.7a33.305 33.305 0 0 1-33.268-33.268A33.305 33.305 0 0 1 128 95.439a33.305 33.305 0 0 1 33.263 33.265A33.305 33.305 0 0 1 128 161.972Z"
      />
      <path data-name="Rect\xE1ngulo 859" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default PreviewIcon;
