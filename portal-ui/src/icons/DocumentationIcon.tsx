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

const DocumentationIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <g clipPath="url(#prefix__a)">
        <g transform="translate(0 41)">
          <rect
            data-name="Rect\xE1ngulo 801"
            width={117.064}
            height={25.116}
            rx={0.908}
            transform="translate(93.838)"
          />
          <rect
            data-name="Rect\xE1ngulo 821"
            width={117.064}
            height={25.116}
            rx={0.908}
            transform="translate(93.838 105)"
          />
          <rect
            data-name="Rect\xE1ngulo 822"
            width={117.064}
            height={25.116}
            rx={0.908}
            transform="translate(93.838 53)"
          />
          <path
            data-name="Trazado 357"
            d="M143.734 189.393H24.57V36.448a8.842 8.842 0 00-8.648-8.961H8.633A8.844 8.844 0 000 36.448V206.04a8.844 8.844 0 008.633 8.961h135.1a8.847 8.847 0 008.648-8.961v-7.685a8.847 8.847 0 00-8.647-8.962z"
          />
        </g>
        <path
          data-name="Rect\xE1ngulo 818"
          d="M66 20v170h170V20H66M61 0h180a15 15 0 0115 15v180a15 15 0 01-15 15H61a15 15 0 01-15-15V15A15 15 0 0161 0z"
        />
      </g>
    </svg>
  );
};

export default DocumentationIcon;
