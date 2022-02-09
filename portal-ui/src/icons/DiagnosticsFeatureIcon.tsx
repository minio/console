// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

const DiagnosticsFeatureIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 26 25"
    {...props}
  >
    <g id="Grupo_2542" data-name="Grupo 2542" transform="translate(0 0.249)">
      <g id="health-icon" transform="translate(0 7.842)">
        <path
          id="Unión_51"
          data-name="Unión 51"
          d="M1.977,17A1.976,1.976,0,0,1,0,15.015V4.938H2.144v9.918h9.892V17Zm12.591-.443V14.584h1.974v1.973Zm.288-4.538V2.144H4.965V0H15.023A1.98,1.98,0,0,1,17,1.973V12.019Zm-4.8,0V10.045h1.979v1.973Zm-5.094,0V10.045H6.944v1.973Zm5.094-5.106V4.938h1.979V6.912Zm-5.09,0V4.938H6.942V6.912ZM.458,2.448V.475H2.432V2.448Z"
          transform="translate(0 -0.091)"
          fill="#07193e"
        />
      </g>
      <g id="Grupo_2537" data-name="Grupo 2537" transform="translate(12.323 0)">
        <g
          id="Elipse_623"
          data-name="Elipse 623"
          transform="translate(-0.323 -0.249)"
          fill="#4ccb92"
          stroke="#fff"
          strokeWidth="1"
        >
          <circle cx="7" cy="7" r="7" stroke="none" />
          <circle cx="7" cy="7" r="6.5" fill="none" />
        </g>
        <g id="check" transform="translate(2.934 4.069)">
          <path
            id="Trazado_7261"
            data-name="Trazado 7261"
            d="M14.9,10.862a.622.622,0,1,1,.889.871l-3.311,4.139a.622.622,0,0,1-.9.017L9.384,13.694a.622.622,0,1,1,.879-.879L12,14.551l2.881-3.67.017-.018Z"
            transform="translate(-9.182 -10.676)"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default DiagnosticsFeatureIcon;
