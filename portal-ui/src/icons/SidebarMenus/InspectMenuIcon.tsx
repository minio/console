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

const InspectMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 12 12.001"
    {...props}
  >
    <path
      id="InspectIcon"
      d="M-2191.428,31a1.876,1.876,0,0,1-1.715-2V27.5h1.285V29a.47.47,0,0,0,.429.5h6.857a.47.47,0,0,0,.428-.5V27.5h1.286V29a1.877,1.877,0,0,1-1.715,2ZM-2194,26V24h12v2Zm2.142-3.5h-1.284V21a1.876,1.876,0,0,1,1.715-2h6.857a1.876,1.876,0,0,1,1.715,2v1.5h-1.286V21a.469.469,0,0,0-.428-.5h-6.857a.469.469,0,0,0-.429.5v1.5h0Z"
      transform="translate(2194 -19)"
    />
  </svg>
);

export default InspectMenuIcon;
