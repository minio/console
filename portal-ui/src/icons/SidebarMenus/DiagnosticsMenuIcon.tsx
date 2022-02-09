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

const DiagnosticsMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 12 12"
    {...props}
  >
    <g id="diagnostic-icn-full" transform="translate(0 -0.131)">
      <path
        id="Unión_17"
        data-name="Unión 17"
        d="M0,5.962A5.956,5.956,0,0,1,5.935,0h.491V2.461a3.512,3.512,0,1,1-.981,0V1.009a4.893,4.893,0,0,0-1.752.515A4.981,4.981,0,0,0,2.276,2.611a4.994,4.994,0,0,0-.949,1.524,4.96,4.96,0,1,0,9.564,1.827.49.49,0,0,1,.144-.348.485.485,0,0,1,.346-.144.492.492,0,0,1,.491.493A5.936,5.936,0,1,1,0,5.962ZM4.634,3.771a2.553,2.553,0,0,0-.806,3.618,2.568,2.568,0,0,0,.687.69,2.541,2.541,0,0,0,.432.236,2.51,2.51,0,0,0,.989.2,2.555,2.555,0,0,0,1.3-4.745,2.522,2.522,0,0,0-.811-.313V4.878a1.2,1.2,0,0,1,.5.431,1.188,1.188,0,1,1-1.986,0,1.2,1.2,0,0,1,.5-.431V3.458A2.521,2.521,0,0,0,4.634,3.771Z"
        transform="translate(0.129 0.131)"
      />
      <rect
        id="Rectángulo_878"
        data-name="Rectángulo 878"
        width="11.92"
        height="11.975"
        transform="translate(0 0.156)"
        fill="none"
      />
    </g>
  </svg>
);

export default DiagnosticsMenuIcon;
