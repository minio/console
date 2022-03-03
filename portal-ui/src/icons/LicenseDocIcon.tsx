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

const LicenseDocIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 16 15.1"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-lic-doc">
        <rect
          id="Rectángulo_963"
          data-name="Rectángulo 963"
          width="16"
          height="15.1"
          fill={"currentcolor"}
        />
      </clipPath>
    </defs>
    <g
      id="Grupo_2324"
      data-name="Grupo 2324"
      clipPath="url(#clip-path-lic-doc)"
    >
      <path
        id="Trazado_7051"
        data-name="Trazado 7051"
        d="M12.118,0A3.867,3.867,0,0,0,9.051,1.506a3.9,3.9,0,0,0-.687,1.4L.948,2.975A.988.988,0,0,0,0,4V14.079A.988.988,0,0,0,.948,15.1H12.105a.987.987,0,0,0,.947-1.021V7.645a3.871,3.871,0,0,0,1.17-.508,3.914,3.914,0,0,0,.935-.848A3.878,3.878,0,0,0,12.118,0M1.057,5.621a.516.516,0,0,1,.515-.515h3.8a.516.516,0,0,1,.515.515v.686a.516.516,0,0,1-.515.515h-3.8a.516.516,0,0,1-.515-.515Zm10.7,7.573a.516.516,0,0,1-.515.515H1.571a.516.516,0,0,1-.515-.515v-.686a.516.516,0,0,1,.515-.515h9.666a.516.516,0,0,1,.515.515Zm0-3.443a.516.516,0,0,1-.515.515H1.571a.516.516,0,0,1-.515-.515V9.064a.516.516,0,0,1,.515-.515h9.666a.516.516,0,0,1,.515.515Zm2.025-6.511,0,0L12.026,4.988a.388.388,0,0,1-.28.118h0a.389.389,0,0,1-.28-.118l-.873-.873a.4.4,0,0,1,.564-.565l.59.591L13.21,2.678a.4.4,0,0,1,.561,0l0,0a.4.4,0,0,1,0,.561"
        fill={"currentcolor"}
      />
    </g>
  </svg>
);

export default LicenseDocIcon;
