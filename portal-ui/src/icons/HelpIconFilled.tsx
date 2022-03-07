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

const HelpIconFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 21 21"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-help-icon">
        <rect
          id="Rectángulo_961"
          data-name="Rectángulo 961"
          width="21"
          height="21"
          transform="translate(0 -0.159)"
          fill={"currentcolor"}
        />
      </clipPath>
    </defs>
    <g id="HelpIcon-Full" transform="translate(0 0.159)">
      <g
        id="Grupo_2320"
        data-name="Grupo 2320"
        clipPath="url(#clip-path-help-icon)"
      >
        <path
          id="Trazado_7048"
          data-name="Trazado 7048"
          d="M10.42,0A10.42,10.42,0,1,0,20.84,10.42,10.42,10.42,0,0,0,10.42,0M9.534,18.477a2,2,0,0,1-1.953-1.953h0a1.943,1.943,0,1,1,1.953,1.953m1.309-6.32-.082,1.176H8.3V9.856h.982c1.974,0,3.037-.624,3.037-1.82,0-1.1-1.053-1.7-3.007-1.7-.552,0-1.125.041-1.554.081L7.561,3.73A15.939,15.939,0,0,1,9.626,3.6c3.569,0,5.635,1.647,5.635,4.234,0,2.362-1.575,3.876-4.418,4.326"
          fill={"currentcolor"}
        />
      </g>
    </g>
  </svg>
);

export default HelpIconFilled;
