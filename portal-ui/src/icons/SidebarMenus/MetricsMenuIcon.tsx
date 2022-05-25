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

const MetricsMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 12 12"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-metrics-menu-icon">
        <rect
          id="Rectángulo_946"
          data-name="Rectángulo 946"
          width="12"
          height="12"
          transform="translate(0 0)"
        />
      </clipPath>
    </defs>
    <g id="DashboardIcon-Full" transform="translate(0.037 0.021)">
      <g
        id="Grupo_2300"
        data-name="Grupo 2300"
        transform="translate(-0.037 -0.021)"
        clipPath="url(#clip-path-metrics-menu-icon)"
      >
        <path
          id="Trazado_7036"
          data-name="Trazado 7036"
          d="M11.722.239A.805.805,0,0,0,11.15,0H.809A.811.811,0,0,0,0,.81V11.151a.811.811,0,0,0,.809.809H11.15a.811.811,0,0,0,.809-.809V.811a.805.805,0,0,0-.237-.572M1.935,2.544a.724.724,0,0,1,.724-.724H4.94a.724.724,0,0,1,.724.724V3.613a.724.724,0,0,1-.724.724H2.659a.724.724,0,0,1-.724-.724Zm3.73,6.932a.7.7,0,0,1-.724.664H2.659a.7.7,0,0,1-.724-.664V6.01a.7.7,0,0,1,.724-.664H4.94a.7.7,0,0,1,.724.664Zm4.627-.059a.724.724,0,0,1-.724.724H7.286a.724.724,0,0,1-.724-.724V8.349a.724.724,0,0,1,.724-.724H9.568a.724.724,0,0,1,.724.724Zm0-3.466a.7.7,0,0,1-.724.664H7.286a.7.7,0,0,1-.724-.664V2.484a.7.7,0,0,1,.724-.664H9.567a.7.7,0,0,1,.724.664Z"
          transform="translate(0.006 0.002)"
        />
      </g>
    </g>
  </svg>
);

export default MetricsMenuIcon;
