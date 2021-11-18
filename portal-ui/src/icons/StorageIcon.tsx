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

const StorageIcon = (props: SVGProps<SVGSVGElement>) => {
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
        <g transform="translate(.001)" stroke="#000" strokeWidth={0.2}>
          <path
            data-name="Trazado 396"
            d="M241.464 0H14.521A14.453 14.453 0 00.001 14.342v52.113a14.453 14.453 0 0014.52 14.344h226.943A14.457 14.457 0 00256 66.455V14.342A14.457 14.457 0 00241.464 0zm.285 66.455a.283.283 0 01-.285.281L14.24 66.455l.281-52.393 227.229.279z"
          />
          <path
            data-name="Trazado 397"
            d="M241.464 87.969H14.521a14.452 14.452 0 00-14.52 14.342v52.109a14.453 14.453 0 0014.52 14.346h226.943A14.456 14.456 0 00256 154.42v-52.109a14.456 14.456 0 00-14.536-14.342zm.285 66.451a.282.282 0 01-.285.281L14.24 154.42l.281-52.393 227.229.283z"
          />
          <path
            data-name="Trazado 398"
            d="M241.464 175.934H14.521a14.461 14.461 0 00-14.52 14.352v52.109a14.454 14.454 0 0014.52 14.346h226.943A14.458 14.458 0 00256 242.395v-52.109a14.465 14.465 0 00-14.536-14.352zm.285 66.461a.279.279 0 01-.285.281l-227.224-.281.281-52.4 227.229.287z"
          />
          <rect
            data-name="Rect\xE1ngulo 813"
            width={23.651}
            height={15.74}
            rx={0.643}
            transform="translate(20.301 22.054)"
          />
          <rect
            data-name="Rect\xE1ngulo 814"
            width={23.651}
            height={15.741}
            rx={0.643}
            transform="translate(20.301 111.377)"
          />
          <rect
            data-name="Rect\xE1ngulo 815"
            width={23.651}
            height={15.741}
            rx={0.643}
            transform="translate(20.301 200.594)"
          />
        </g>
      </g>
    </svg>
  );
};

export default StorageIcon;
