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

import React, { SVGProps } from "react";

const ReportedUsageFullIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      viewBox="0 0 37.001 37"
      {...props}
    >
      <defs>
        <clipPath id="rep-quota-clip-path">
          <rect
            id="Rectángulo_959"
            data-name="Rectángulo 959"
            width="37"
            height="37"
            transform="translate(0 0)"
          />
        </clipPath>
      </defs>
      <g id="reported-usage-icn-full" transform="translate(-0.213 -0.213)">
        <rect
          id="Rectángulo_869"
          data-name="Rectángulo 869"
          width="37"
          height="37"
          transform="translate(0.213 0.213)"
          fill="none"
        />
        <g
          id="Grupo_2317"
          data-name="Grupo 2317"
          transform="translate(0.213 0.213)"
        >
          <g
            id="Grupo_2316"
            data-name="Grupo 2316"
            transform="translate(0 0)"
            clipPath="url(#rep-quota-clip-path)"
          >
            <path
              id="Trazado_7046"
              data-name="Trazado 7046"
              d="M18.5,0A18.5,18.5,0,1,0,37,18.5,18.5,18.5,0,0,0,18.5,0m0,18.5V4.756A13.757,13.757,0,0,1,32.238,18.5H18.5Z"
              transform="translate(0.074 0.074)"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};

export default ReportedUsageFullIcon;
