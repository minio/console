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

const ShowTextIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 15 15"
    {...props}
  >
    <g id="OpenListIcon-full" transform="translate(4 4.984)">
      <g
        id="noun_chevron_2320228"
        transform="translate(0.167 4.016) rotate(-90)"
      >
        <path
          id="Trazado_6842"
          data-name="Trazado 6842"
          d="M.422,0a.433.433,0,0,0-.3.117.37.37,0,0,0,0,.557L2.983,3.325.126,5.986a.37.37,0,0,0,0,.557.443.443,0,0,0,.6,0L3.889,3.609a.373.373,0,0,0,.126-.274.344.344,0,0,0-.126-.274L.727.127A.443.443,0,0,0,.422,0Z"
          transform="translate(0 0)"
        />
      </g>
      <rect
        id="Rectángulo_896"
        data-name="Rectángulo 896"
        width="0.462"
        height="0.462"
        transform="translate(0 1.75)"
        fill="none"
      />
    </g>
  </svg>
);

export default ShowTextIcon;
