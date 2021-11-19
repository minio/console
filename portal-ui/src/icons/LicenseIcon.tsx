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

const LicenseIcon = (props: SVGProps<SVGSVGElement>) => {
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
        <g transform="translate(0 7)" stroke="#000" strokeWidth={0.2}>
          <path
            data-name="Trazado 354"
            d="M193.942 0a62.108 62.108 0 00-29.748 7.587A62.053 62.053 0 00133.9 46.6L15.083 47.639c-8.315 0-15.086 7.292-15.086 16.252v161.443c0 8.96 6.771 16.244 15.086 16.244h178.659c8.314 0 15.07-7.284 15.07-16.244v-103.09A62.124 62.124 0 00256 62.061 62.134 62.134 0 00193.942 0zm-.8 210.649c0 7.75-5.834 14.033-13.016 14.033h-151.4c-7.2 0-13.039-6.283-13.039-14.033V78.569c0-7.75 5.843-14.026 13.039-14.026h103.282a62.076 62.076 0 0061.133 59.539zm15.677-104.525v-.38a6.578 6.578 0 01-.417.535 46.408 46.408 0 01-14.457 2.327A46.59 46.59 0 01147.4 62.061a46.55 46.55 0 0124.244-40.867 46.566 46.566 0 0122.3-5.679 46.6 46.6 0 0146.55 46.546 46.6 46.6 0 01-31.679 44.063z"
          />
          <path
            data-name="Trazado 355"
            d="M223.044 45.923a6.254 6.254 0 00-8.834.054l-23.551 23.506-9.52-9.526a6.3 6.3 0 00-8.583 0 6.3 6.3 0 00-.315 8.9l13.976 13.971a6.18 6.18 0 004.441 1.854 6.14 6.14 0 004.457-1.854l27.984-27.951.055-.054a6.242 6.242 0 00-.055-8.844z"
          />
          <rect
            data-name="Rect\xE1ngulo 798"
            width={89.868}
            height={22.467}
            rx={0.908}
            transform="translate(44.912 89.868)"
          />
          <rect
            data-name="Rect\xE1ngulo 799"
            width={112.335}
            height={22.467}
            rx={0.908}
            transform="translate(44.912 134.802)"
          />
          <rect
            data-name="Rect\xE1ngulo 800"
            width={112.335}
            height={22.467}
            rx={0.908}
            transform="translate(44.912 179.735)"
          />
        </g>
      </g>
    </svg>
  );
};

export default LicenseIcon;
