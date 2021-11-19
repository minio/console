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

const DashboardIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      //
      //
      viewBox="0 0 256 256"
    >
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 0h256v256H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)">
        <g stroke="#000" strokeWidth={0.1}>
          <path
            data-name="Trazado 317"
            d="M238.72 0H17.28A17.318 17.318 0 000 17.28V238.7a17.325 17.325 0 0017.28 17.28h221.44A17.318 17.318 0 00256 238.7V17.3A17.312 17.312 0 00238.72 0zm-.7 223.072a14.938 14.938 0 01-14.931 14.938H32.928a14.938 14.938 0 01-14.938-14.938V32.928A14.938 14.938 0 0132.928 17.99h190.15a14.938 14.938 0 0114.932 14.938z"
          />
          <path
            data-name="Trazado 318"
            d="M105.746 114.442H56.899c-8.525 0-15.456 6.355-15.456 14.169v74.24c0 7.808 6.931 14.17 15.456 14.17h48.851c8.525 0 15.456-6.362 15.456-14.17v-74.24c-.007-7.814-6.935-14.169-15.46-14.169z"
          />
          <path
            data-name="Trazado 319"
            d="M56.899 38.955h48.845a15.462 15.462 0 0115.455 15.462v22.88a15.462 15.462 0 01-15.462 15.462H56.899a15.456 15.456 0 01-15.46-15.455V54.411a15.456 15.456 0 0115.46-15.456z"
          />
          <path
            data-name="Trazado 320"
            d="M204.825 38.955h-48.844c-8.525 0-15.456 6.355-15.456 14.169v74.24c0 7.814 6.931 14.17 15.456 14.17h48.844c8.525 0 15.463-6.355 15.463-14.17v-74.24c0-7.814-6.937-14.169-15.463-14.169z"
          />
          <path
            data-name="Trazado 321"
            d="M155.981 163.25h48.851a15.456 15.456 0 0115.456 15.456v22.88a15.456 15.456 0 01-15.456 15.456h-48.851a15.462 15.462 0 01-15.462-15.462v-22.874a15.456 15.456 0 0115.462-15.456z"
          />
        </g>
      </g>
    </svg>
  );
};

export default DashboardIcon;
