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

const ConfirmModalIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={"min-icon"}
    viewBox="0 0 256 256"
    {...props}
  >
    <defs>
      <clipPath id="clip-path">
        <rect
          id="Rectángulo_1028"
          data-name="Rectángulo 1028"
          width="256"
          height="256"
          fill="none"
        />
      </clipPath>
      <clipPath id="clip-Generic_Confirmation">
        <rect width="256" height="256" />
      </clipPath>
    </defs>
    <g
      id="Generic_Confirmation"
      data-name="Generic Confirmation"
      clipPath="url(#clip-Generic_Confirmation)"
    >
      <rect width="256" height="256" fill="#fff" />
      <g id="Generic_Confirmation_Icon" data-name="Generic Confirmation Icon">
        <g id="Grupo_2416" data-name="Grupo 2416">
          <path
            id="Trazado_7167"
            data-name="Trazado 7167"
            d="M128,0A128,128,0,1,0,256,128,128,128,0,0,0,128,0m.762,229.13A101.13,101.13,0,1,1,229.892,128a101.13,101.13,0,0,1-101.13,101.13M167.851,81.8,111,137.769,90.83,117.862A14.916,14.916,0,0,0,69.884,139.1l41.148,40.543,77.952-76.6a14.973,14.973,0,1,0-20.732-21.609q-.188.181-.37.367Z"
            fill="#4ccb92"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default ConfirmModalIcon;
