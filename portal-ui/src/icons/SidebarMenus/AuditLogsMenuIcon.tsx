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

const AuditLogsMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 14.117 13"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-audit-log-menu-icon">
        <rect
          id="Rectángulo_1591"
          data-name="Rectángulo 1591"
          width="14.117"
          height="13"
        />
      </clipPath>
    </defs>
    <g
      id="Grupo_2463"
      data-name="Grupo 2463"
      clipPath="url(#clip-path-audit-log-menu-icon)"
    >
      <path
        id="Trazado_7111"
        data-name="Trazado 7111"
        d="M10.518,108.483a5.376,5.376,0,0,1-2.413.561H8.093a5.47,5.47,0,0,1-4.394-2.2H1.142a.3.3,0,0,1-.29-.3h0v-.694a.3.3,0,0,1,.29-.3H2.987a5.318,5.318,0,0,1-.248-.857H0v6.482a.732.732,0,0,0,.731.726h9.415a.732.732,0,0,0,.731-.726v-2.333Z"
        transform="translate(0 -98.898)"
      />
      <path
        id="Trazado_7112"
        data-name="Trazado 7112"
        d="M2.636,41.038a5.331,5.331,0,0,1,.683-2.616H.731A.732.732,0,0,0,0,39.154v2.125H2.641c0-.08-.006-.16-.006-.241"
        transform="translate(0 -36.296)"
      />
      <path
        id="Trazado_7114"
        data-name="Trazado 7114"
        d="M70.167,9.1h0L68.422,7.37a4.685,4.685,0,0,0,.809-2.629,4.795,4.795,0,0,0-9.589,0,4.773,4.773,0,0,0,4.793,4.741h.014a4.754,4.754,0,0,0,2.524-.719l1.779,1.757a1.008,1.008,0,0,0,.7.3h.011a1.005,1.005,0,0,0,.7-1.714M64.394,7.53a2.8,2.8,0,0,1-2.819-2.777,2.819,2.819,0,0,1,5.637,0A2.8,2.8,0,0,1,64.394,7.53"
        transform="translate(-56.343)"
      />
    </g>
  </svg>
);

export default AuditLogsMenuIcon;
