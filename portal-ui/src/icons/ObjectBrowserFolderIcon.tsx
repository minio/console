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

import React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIcon } from "./props";
const ObjectBrowserFolderIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28.141 23.33">
        <g data-name="Grupo 1541" transform="translate(9.678 9.015)">
          <circle
            data-name="Elipse 57"
            cx={1.268}
            cy={1.268}
            r={1.268}
            transform="rotate(-10.901 30.906 -19.657)"
          />
          <rect
            data-name="Rect\xE1ngulo 805"
            width={2.707}
            height={2.295}
            rx={1.148}
            transform="translate(1.601 2.812)"
          />
          <path
            data-name="Trazado 365"
            d="M3.099 6.637a.267.267 0 00-.463 0l-1 1.735a.267.267 0 00.231.4h2a.267.267 0 00.232-.4z"
          />
          <path
            data-name="Trazado 366"
            d="M8.726 3.104a16.588 16.588 0 00-.021-1.927A1.119 1.119 0 007.988.135a1.734 1.734 0 00-.2-.058 4.224 4.224 0 00-.807-.073c-.472-.014-.943.015-1.415.013-.945 0-1.889.013-2.834.017H.695a.694.694 0 00-.693.693v8.874a.694.694 0 00.693.693h7.34a.694.694 0 00.693-.693V5.18c-.001-.691-.019-1.386-.002-2.076zm-.842 5.871a.6.6 0 01-.6.6H1.317a.6.6 0 01-.6-.6V1.354a.6.6 0 01.6-.6h4v1.024a1.52 1.52 0 001.518 1.518h1.043zm0-6.34H6.841a.857.857 0 01-.856-.856V.755h1.3a.6.6 0 01.6.6z"
          />
        </g>
        <path
          data-name="Trazado 367"
          d="M11.182 2.209c.726 0 1.5 2.076 2.283 2.076h9.68a1.041 1.041 0 011.038 1.038v.519H4.435V3.247h-.026a1.041 1.041 0 011.038-1.038h5.735m13.674 4.9a1.079 1.079 0 011.076 1.076l-1.1 11.862a1.079 1.079 0 01-1.076 1.076H4.363a1.079 1.079 0 01-1.076-1.076L2.211 8.185a1.079 1.079 0 011.076-1.076h21.571M11.184.001H5.449a3.25 3.25 0 00-3.247 3.247 2.22 2.22 0 00.026.339v1.487a3.291 3.291 0 00-2.227 3.11c0 .067 0 .133.009.2l1.069 11.788a3.288 3.288 0 003.282 3.158h19.393a3.288 3.288 0 003.282-3.155l1.1-11.786c.006-.068.009-.136.009-.2a3.288 3.288 0 00-1.749-2.9 3.251 3.251 0 00-3.247-3.2H14.19l-.124-.167a3.694 3.694 0 00-2.88-1.909z"
        />
      </svg>
    </SvgIcon>
  );
};

export default ObjectBrowserFolderIcon;
