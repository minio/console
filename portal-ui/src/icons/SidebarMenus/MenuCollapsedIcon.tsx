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

const MenuCollapsedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 15 15"
    {...props}
  >
    <g id="Grupo_2449" data-name="Grupo 2449" transform="translate(-140 -181)">
      <rect
        id="Rectángulo_1589"
        data-name="Rectángulo 1589"
        width="15"
        height="15"
        rx="2"
        transform="translate(140 181)"
        fill="#08193a"
        opacity="0.601"
      />
      <g id="OpenListIcon-full" transform="translate(144 250.612)">
        <g
          id="noun_chevron_2320228"
          transform="translate(6.827 -63.612) rotate(90)"
        >
          <path
            id="Trazado_6842"
            data-name="Trazado 6842"
            d="M.422,6.661a.433.433,0,0,1-.3-.117.37.37,0,0,1,0-.557L2.983,3.335.126.675a.37.37,0,0,1,0-.557.443.443,0,0,1,.6,0L3.889,3.052a.373.373,0,0,1,.126.274.344.344,0,0,1-.126.274L.727,6.533a.443.443,0,0,1-.306.127Z"
            transform="translate(0 0)"
          />
        </g>
        <rect
          id="Rectángulo_896"
          data-name="Rectángulo 896"
          width="0.462"
          height="0.462"
          transform="translate(0 -61.808)"
          fill="none"
        />
      </g>
    </g>
  </svg>
);

export default MenuCollapsedIcon;
