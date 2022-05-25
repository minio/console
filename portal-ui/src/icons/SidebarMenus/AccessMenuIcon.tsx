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

const AccessMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 11.749 16"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-access-menu-icon">
        <rect
          id="Rectángulo_1586"
          data-name="Rectángulo 1586"
          width="11.749"
          height="16"
        />
      </clipPath>
    </defs>
    <g
      id="Grupo_2439"
      data-name="Grupo 2439"
      clipPath="url(#clip-path-access-menu-icon)"
    >
      <path
        id="Trazado_7102"
        data-name="Trazado 7102"
        d="M11.018,3.348h-2.1c.009-.1.014-.194.014-.293a3.057,3.057,0,0,0-6.113,0c0,.1.005.2.015.3H.744A1.019,1.019,0,0,0,0,4.343v5.913A2.814,2.814,0,0,0,.4,11.7c1,1.676,2.625,2.648,4.955,4.143A.965.965,0,0,0,5.88,16h0a.956.956,0,0,0,.5-.145c2.264-1.4,3.8-2.315,4.984-4.234a2.665,2.665,0,0,0,.381-1.4V4.337a1.024,1.024,0,0,0-.731-.989M5.875,1.05a2,2,0,0,1,1.983,2.3l-3.966,0a2,2,0,0,1,1.983-2.3m0,4.073a2.189,2.189,0,1,1,0,4.377h0a2.189,2.189,0,1,1,0-4.377m2.786,7.212a1,1,0,0,1-.162.233.984.984,0,0,1-.216.175,1.028,1.028,0,0,1-.26.109,1.127,1.127,0,0,1-.29.038H4.023a1.123,1.123,0,0,1-.29-.037,1.04,1.04,0,0,1-.259-.108,1,1,0,0,1-.218-.172,1.019,1.019,0,0,1-.164-.23,1.112,1.112,0,0,1,.086-1.15c.017-.026.036-.05.055-.074A3.376,3.376,0,0,1,5.346,9.88,3.182,3.182,0,0,1,5.7,9.841h.017c.048,0,.1,0,.145,0a3.348,3.348,0,0,1,.72.079,3.506,3.506,0,0,1,.7.234,3.33,3.33,0,0,1,1.262.992h0a1.136,1.136,0,0,1,.123,1.193"
        transform="translate(0 0.001)"
      />
    </g>
  </svg>
);

export default AccessMenuIcon;
