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

const UptimeIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <g data-name="UptimeIcon">
        <path data-name="Rect\xE1ngulo 851" fill="none" d="M0 0h256v256H0z" />
        <g data-name="Grupo 1558">
          <path
            data-name="Sustracci\xF3n 3"
            d="M220.67 154.223h-10.627c.012-.6.016-1.149.016-1.669a82.374 82.374 0 0 0-1.073-13.283h-64.771v-78.9l25.611 11.287 45.143 34.182 4.232 33.5a53.041 53.041 0 0 1 5.371 4.445 22.28 22.28 0 0 1 3.4 3.962c.938 1.48 1.252 2.729.941 3.709-.577 1.836-3.35 2.767-8.243 2.767Z"
            fill="#e3e3e3"
          />
          <path
            data-name="Uni\xF3n 9"
            d="M24.003 152.341a102.96 102.96 0 0 1 24.863-67.172 104.134 104.134 0 0 1 61.651-35.019l.586-.1v22.866l-.4.084a81.178 81.178 0 0 0-64.137 79.337c0 44.762 36.557 81.18 81.492 81.18s81.492-36.418 81.492-81.18a80.636 80.636 0 0 0-18.828-51.854 81.865 81.865 0 0 0-20.838-17.8 80.846 80.846 0 0 0-26.053-10l-.408-.084V49.8l.582.089a103.267 103.267 0 0 1 34.789 11.962 104.595 104.595 0 0 1 27.953 22.727 103.042 103.042 0 0 1 25.363 67.76C232.114 209.5 185.437 256 128.062 256S24.003 209.5 24.003 152.341Zm104.625 9.91a10.07 10.07 0 0 1-1.023-.054c-4.723-.094-9.377-3.03-9.377-8.8V30.467l-10.9 10.113c-8.939 8.3-22.533-4.325-13.594-12.619l27.248-25.3a10.162 10.162 0 0 1 13.719 0l27.252 25.3c8.943 8.294-4.658 20.918-13.6 12.619L137.46 30.467v113.674h41.412a9.055 9.055 0 1 1 0 18.11Z"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default UptimeIcon;
