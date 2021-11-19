// This file is part of MinIO Console Server
// Copyright (c) 2021 MinIO, Inc.
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

const TrashIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      id="Grupo_1557"
      data-name="Grupo 1557"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
    >
      <rect
        id="Rectángulo_826"
        data-name="Rectángulo 826"
        width="256"
        height="256"
        fill="none"
      />
      <g id="trash-icn" transform="translate(19.5 -0.5)">
        <path
          id="Trazado_359"
          data-name="Trazado 359"
          d="M-2150.236-1227.5h72.871a15.389,15.389,0,0,1,15.329,14.218h41.534a15.422,15.422,0,0,1,15.4,15.4v15.931a15.419,15.419,0,0,1-15.4,15.4h-186.6a15.419,15.419,0,0,1-15.4-15.4v-15.931a15.422,15.422,0,0,1,15.4-15.4h41.537A15.386,15.386,0,0,1-2150.236-1227.5Zm69.96,18.285h-67.046V-1195h-56.893v10.158h180.829V-1195h-56.89Z"
          transform="translate(2222.001 1228)"
        />
        <path
          id="Trazado_360"
          data-name="Trazado 360"
          d="M-2070.444-1006.1h-113.163A37.941,37.941,0,0,1-2221.5-1044v-179.5h188.952V-1044A37.94,37.94,0,0,1-2070.444-1006.1Zm-132.769-199.112V-1044a19.632,19.632,0,0,0,19.606,19.614h113.163a19.635,19.635,0,0,0,19.61-19.614v-161.213Z"
          transform="translate(2235.223 1262.603)"
        />
      </g>
    </svg>
  );
};

export default TrashIcon;
