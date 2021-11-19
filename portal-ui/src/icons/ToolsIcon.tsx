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

const ToolsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 17 16.986"
    >
      <g data-name="Grupo 1868">
        <path
          data-name="Trazado 6843"
          d="M15.1.004l-3.247 1.76.016.961-2.387 2.387 2.411 2.411 2.42-2.42h.871l1.82-3.206z"
        />
        <path
          data-name="Trazado 6844"
          d="M4.792 9.804L.267 14.329a.852.852 0 000 1.205l1.205 1.206a.853.853 0 001.206 0l4.524-4.525z"
        />
      </g>
      <path
        data-name="Trazado 6845"
        d="M16.415 14.325L6.679 4.59A3.381 3.381 0 002.527.437l2.069 2.067-2.411 2.411L.116 2.846a3.381 3.381 0 004.153 4.158l9.735 9.736a.853.853 0 001.206 0l1.205-1.206a.852.852 0 000-1.209z"
      />
    </svg>
  );
};

export default ToolsIcon;
