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

const PrometheusIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <g data-name="PrometheusIcon">
        <path d="M128.908 0a128 128 0 1 0 128 128 128 128 0 0 0-128-128Zm0 239.565c-20.112 0-36.42-13.435-36.42-30h72.839c.004 16.561-16.302 30-36.419 30Zm60.154-39.941H68.751v-21.818h120.317v21.817Zm-.432-33.046H69.094c-.4-.458-.8-.91-1.188-1.375-12.315-14.954-15.216-22.76-18.032-30.717-.048-.262 14.933 3.06 25.556 5.45 0 0 5.466 1.265 13.458 2.722a49.95 49.95 0 0 1-12.23-32.117c0-25.658 19.68-48.08 12.58-66.2 6.91.562 14.3 14.583 14.8 36.506 7.346-10.152 10.42-28.691 10.42-40.057 0-11.769 7.755-25.44 15.512-25.908-6.915 11.4 1.79 21.165 9.53 45.4 2.9 9.1 2.532 24.423 4.772 34.139.744-20.178 4.213-49.621 17.014-59.785-5.647 12.8.836 28.819 5.27 36.519 7.154 12.424 11.49 21.836 11.49 39.639a49.518 49.518 0 0 1-11.84 31.959c8.452-1.586 14.289-3.016 14.289-3.016l27.451-5.355s-3.985 16.4-19.312 32.196Z" />
        <path data-name="Rect\xE1ngulo 895" fill="none" d="M0 0h256v256H0z" />
      </g>
    </g>
  </svg>
);

export default PrometheusIcon;
