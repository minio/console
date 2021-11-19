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

const drivesIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 207.229"
    >
      <rect
        data-name="Rect\xE1ngulo 823"
        width={200.184}
        height={13.282}
        rx={6.641}
        transform="translate(27.909 164.281)"
      />
      <circle
        data-name="Elipse 61"
        cx={10.385}
        cy={10.385}
        r={10.385}
        transform="translate(28.182 138.693)"
      />
      <circle
        data-name="Elipse 62"
        cx={10.385}
        cy={10.385}
        r={10.385}
        transform="rotate(-9.25 900.786 -279.68)"
      />
      <path
        data-name="Trazado 405"
        d="M255.699 130.149a37.6 37.6 0 00-2.994-12.568l-41.95-104.219C207.537 5.62 199.33 0 191.241 0H64.759c-8.089 0-16.3 5.62-19.514 13.362L3.295 117.581a37.61 37.61 0 00-2.994 12.568 22.107 22.107 0 00-.3 3.612v51.4a22.089 22.089 0 0022.065 22.064h211.87a22.09 22.09 0 0022.065-22.064v-51.4a22.134 22.134 0 00-.302-3.612zM65.754 22.413h124.491l36.053 89.283H30.013zm167.833 162.4H22.412v-50.708h211.175z"
      />
    </svg>
  );
};

export default drivesIcon;
