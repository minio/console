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

const PrometheusErrorIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 23.786 22.2"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-prom-error">
        <rect
          id="Rectángulo_1578"
          data-name="Rectángulo 1578"
          width="23.786"
          height="22.2"
          fill="none"
        />
      </clipPath>
    </defs>
    <g
      id="Grupo_2402"
      data-name="Grupo 2402"
      clipPath="url(#clip-path-prom-error)"
    >
      <path
        id="Trazado_7049"
        data-name="Trazado 7049"
        d="M23.786,7.136a3.967,3.967,0,0,0-4.824-3.871A11.1,11.1,0,1,0,22.2,11.1c0-.26-.01-.518-.027-.773a3.958,3.958,0,0,0,1.613-3.192M11.1,20.776v0a2.92,2.92,0,0,1-3.158-2.6h6.317a2.922,2.922,0,0,1-3.159,2.6m5.217-3.464H5.883V15.42H16.317Zm-.038-2.865H5.913c-.035-.04-.07-.079-.1-.119a7.561,7.561,0,0,1-1.564-2.664c0-.023,1.295.266,2.22.476,0,0,.476.109,1.167.238A4.332,4.332,0,0,1,6.573,9.592c0-2.225,1.707-4.17,1.091-5.741.6.048,1.24,1.269,1.284,3.166a6.8,6.8,0,0,0,.9-3.474c0-1.02.672-2.207,1.348-2.247-.6.988.159,1.835.826,3.937.251.793.22,2.118.414,2.961.064-1.75.366-4.3,1.476-5.185a3.83,3.83,0,0,0,.457,3.167,6,6,0,0,1,1,3.437,4.294,4.294,0,0,1-1.031,2.775c.733-.137,1.239-.262,1.239-.262l2.379-.465a6.749,6.749,0,0,1-1.676,2.785M19.822,10.7A3.568,3.568,0,1,1,23.39,7.136,3.568,3.568,0,0,1,19.822,10.7"
        transform="translate(0 -0.001)"
        fill="#c83b51"
      />
      <path
        id="Trazado_7050"
        data-name="Trazado 7050"
        d="M491.022,131.222l.121-2.851h-1.17l.121,2.851Z"
        transform="translate(-470.607 -123.297)"
        fill="#c83b51"
      />
      <path
        id="Trazado_7051"
        data-name="Trazado 7051"
        d="M488.865,209.66a.655.655,0,1,0,.65.65.667.667,0,0,0-.65-.65"
        transform="translate(-468.913 -201.374)"
        fill="#c83b51"
      />
    </g>
  </svg>
);

export default PrometheusErrorIcon;
