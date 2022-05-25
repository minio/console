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

const ObjectBrowserFolderIcon = (props: SVGProps<SVGSVGElement>) => {
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
        <g data-name="Grupo 1541" transform="translate(87.918 103.898)">
          <circle
            data-name="Elipse 57"
            cx={11.515}
            cy={11.515}
            r={11.515}
            transform="rotate(-10.901 280.738 -178.561)"
          />
          <rect
            data-name="Rect\xE1ngulo 805"
            width={24.592}
            height={20.853}
            rx={1.35}
            transform="translate(14.546 25.545)"
          />
          <path
            data-name="Trazado 365"
            d="M28.151 60.295a2.427 2.427 0 00-4.2 0l-9.1 15.761a2.425 2.425 0 002.1 3.64h18.2a2.43 2.43 0 002.105-3.64z"
          />
          <path
            data-name="Trazado 366"
            d="M79.273 28.199a151.334 151.334 0 00-.187-17.51c-.395-4.294-2.262-7.942-6.512-9.468a15.5 15.5 0 00-1.836-.529 38.335 38.335 0 00-7.332-.658c-4.289-.125-8.57.136-12.855.116-8.582-.036-17.16.116-25.746.152H6.301a6.308 6.308 0 00-6.3 6.3v80.617a6.307 6.307 0 006.3 6.3h66.684a6.3 6.3 0 006.3-6.3V47.054c-.004-6.273-.168-12.584-.012-18.855zm-7.648 53.334a5.435 5.435 0 01-5.434 5.439h-54.2a5.442 5.442 0 01-5.441-5.439V12.3a5.441 5.441 0 015.441-5.442h36.367v9.3a13.809 13.809 0 0013.789 13.794h9.48zm0-57.6h-9.48a7.781 7.781 0 01-7.773-7.777v-9.3h11.82a5.435 5.435 0 015.434 5.442z"
          />
        </g>
        <path
          data-name="Trazado 367"
          d="M101.585 42.067c6.6 0 13.672 18.858 20.742 18.858h87.934a9.453 9.453 0 019.426 9.429v4.715H40.292V51.496h-.234a9.455 9.455 0 019.426-9.429h52.1m124.219 44.5a9.8 9.8 0 019.773 9.772L225.56 204.095a9.8 9.8 0 01-9.773 9.771H39.615a9.8 9.8 0 01-9.773-9.771L20.065 96.339a9.806 9.806 0 019.777-9.772h195.961M101.584 21.999h-52.1a29.528 29.528 0 00-29.492 29.5 20.028 20.028 0 00.234 3.081v13.513A29.9 29.9 0 00-.001 96.344c0 .605.031 1.208.086 1.814l9.711 107.089a29.874 29.874 0 0029.82 28.691h176.172a29.873 29.873 0 0029.813-28.663l9.961-107.074c.051-.617.082-1.239.082-1.857a29.875 29.875 0 00-15.887-26.376 29.534 29.534 0 00-29.5-29.106H128.87c-.4-.532-.785-1.059-1.121-1.517-5.094-6.906-12.785-17.342-26.168-17.342z"
        />
      </g>
    </svg>
  );
};

export default ObjectBrowserFolderIcon;
