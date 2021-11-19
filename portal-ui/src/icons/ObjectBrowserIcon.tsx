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

const ObjectBrowserIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 0h256v256H0z" />
        </clipPath>
      </defs>
      <g data-name="Object Browser" clipPath="url(#prefix__a)">
        <g transform="translate(19.001)">
          <circle
            data-name="Elipse 55"
            cx={31.523}
            cy={31.523}
            r={31.523}
            transform="rotate(-10.901 768.453 -488.791)"
          />
          <rect
            data-name="Rect\xE1ngulo 797"
            width={67.32}
            height={57.082}
            rx={1.895}
            transform="translate(39.804 69.922)"
          />
          <path
            data-name="Trazado 322"
            d="M77.056 165.044a6.656 6.656 0 00-11.523 0l-24.893 43.14a6.644 6.644 0 005.758 9.967h49.809a6.649 6.649 0 005.756-9.967z"
          />
          <path
            data-name="Trazado 323"
            d="M217.014 77.196c.375-15.75.949-32.247-.506-47.947-1.1-11.752-6.187-21.735-17.832-25.915a44.135 44.135 0 00-5.014-1.447c-6.561-1.479-13.436-1.6-20.1-1.792-11.725-.342-23.453.361-35.178.313-23.488-.1-46.988.321-70.484.415-2.8.011-5.629.014-8.457.014h-42.2a17.262 17.262 0 00-17.25 17.24v220.688a17.258 17.258 0 0017.25 17.236h182.55a17.246 17.246 0 0017.236-17.236V128.816c0-17.189-.429-34.466-.015-51.62zm-20.93 145.99a14.9 14.9 0 01-14.883 14.893H32.826a14.876 14.876 0 01-14.875-14.893V33.658a14.876 14.876 0 0114.875-14.893h99.549v25.461a37.794 37.794 0 0037.754 37.76h25.955zm0-157.655h-25.955a21.328 21.328 0 01-21.3-21.3V18.77H181.2a14.9 14.9 0 0114.883 14.893z"
          />
        </g>
      </g>
    </svg>
  );
};

export default ObjectBrowserIcon;
