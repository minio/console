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

const PerformanceFeatureIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 25 23"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-perf-feat-icon">
        <rect
          id="Rectángulo_985"
          data-name="Rectángulo 985"
          width="17"
          height="17"
          transform="translate(-0.12 0.298)"
          fill="#07193e"
        />
      </clipPath>
    </defs>
    <g id="Grupo_2543" data-name="Grupo 2543" transform="translate(0.12 0.101)">
      <g id="speedtest-icon-full" transform="translate(0 5.601)">
        <g
          id="Grupo_2352"
          data-name="Grupo 2352"
          transform="translate(0 0)"
          clipPath="url(#clip-path-perf-feat-icon)"
        >
          <path
            id="Trazado_7077"
            data-name="Trazado 7077"
            d="M120.559,129.741a.529.529,0,1,0,.529.529h0a.529.529,0,0,0-.529-.529"
            transform="translate(-112.345 -121.572)"
            fill="#07193e"
          />
          <path
            id="Trazado_7078"
            data-name="Trazado 7078"
            d="M8.2,0a8.2,8.2,0,1,0,8.2,8.2A8.2,8.2,0,0,0,8.2,0M8.16,2.27h.027a.5.5,0,1,1-.008,1H8.16a.5.5,0,0,1,0-1m-5.6,5.5v0a.19.19,0,0,1-.189.164H2.345a.19.19,0,0,1-.164-.214V7.717h0a.189.189,0,0,1,.213-.163h0a.19.19,0,0,1,.162.214M3,6.075H3a.278.278,0,0,1-.244-.406V5.662h0A.278.278,0,1,1,3,6.075M4.54,4.423l-.021.018-.006.005a.34.34,0,0,1-.225.088v0a.341.341,0,0,1-.224-.6l.006-.005h0l0,0a.342.342,0,1,1,.466.5m1.683-.868-.006,0-.011,0a.449.449,0,0,1-.162.034v0a.453.453,0,0,1-.16-.876l.013,0h0a.453.453,0,1,1,.325.845M9.1,12.6h0a.241.241,0,0,1-.241.241h-1.3a.241.241,0,1,1,0-.482h1.3A.241.241,0,0,1,9.1,12.6Zm1.067-4.771-.89.76a.021.021,0,0,0,0,.02,1.1,1.1,0,1,1-.668-.779.021.021,0,0,0,.021,0l.886-.76h0a.5.5,0,0,1,.651.759M10.1,3.7v0a.552.552,0,0,1-.2-.036L9.885,3.65a.554.554,0,0,1,.387-1.039l.019.007A.557.557,0,0,1,10.1,3.7m1.765,1.13a.628.628,0,0,1-.413-.155l-.016-.014a.629.629,0,0,1,.825-.948l.017.015a.628.628,0,0,1-.413,1.1M12.5,6.142l-.012-.022A.722.722,0,0,1,13.743,5.4l.017.032.013.023h0a.722.722,0,0,1-.291.979h0a.722.722,0,0,1-.979-.291m1.385,2.42a.817.817,0,0,1-.921-.7V7.835a.817.817,0,0,1,.809-.927.819.819,0,0,1,.807.7l0,.032a.817.817,0,0,1-.7.918"
            transform="translate(0 -0.138)"
            fill="#07193e"
          />
        </g>
      </g>
      <g id="Grupo_2538" data-name="Grupo 2538" transform="translate(11.203 0)">
        <g
          id="Elipse_623"
          data-name="Elipse 623"
          transform="translate(-0.324 -0.101)"
          fill="#4ccb92"
          stroke="#fff"
          strokeWidth="1"
        >
          <circle cx="7" cy="7" r="7" stroke="none" />
          <circle cx="7" cy="7" r="6.5" fill="none" />
        </g>
        <g id="check" transform="translate(2.797 4.098)">
          <path
            id="Trazado_7261"
            data-name="Trazado 7261"
            d="M14.938,10.864a.627.627,0,1,1,.895.877L12.5,15.91a.627.627,0,0,1-.9.017l-2.21-2.211a.627.627,0,1,1,.886-.886l1.75,1.748,2.9-3.7.017-.018Z"
            transform="translate(-9.182 -10.676)"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default PerformanceFeatureIcon;
