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

const serversIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256.143 255.276"
    >
      <path
        data-name="Trazado 404"
        d="M128.072 0C64.444 0 0 15.224 0 44.289v166.7c0 29.064 64.444 44.289 128.072 44.289s128.072-15.225 128.072-44.289v-166.7C256.143 15.224 191.699 0 128.072 0zm105.8 210.987c0 8.919-37.345 25.835-105.8 25.835s-105.8-17.07-105.8-25.835v-58.744c24.129 11.933 65.187 18.146 105.8 18.146s81.668-6.151 105.8-18.239zm0-84.887c0 8.766-37.345 25.835-105.8 25.835s-105.8-17.069-105.8-25.835V70.339c24.129 12.026 65.187 18.238 105.8 18.238s81.668-6.151 105.8-18.238zm-105.8-55.976c-68.454 0-105.8-17.07-105.8-25.835s37.345-25.835 105.8-25.835 105.8 17.07 105.8 25.835-37.347 25.835-105.8 25.835z"
      />
      <circle
        data-name="Elipse 59"
        cx={15.793}
        cy={15.793}
        r={15.793}
        transform="rotate(-31.72 347.366 44.437)"
      />
      <circle
        data-name="Elipse 60"
        cx={15.793}
        cy={15.793}
        r={15.793}
        transform="rotate(-31.72 206.504 4.417)"
      />
    </svg>
  );
};

export default serversIcon;
