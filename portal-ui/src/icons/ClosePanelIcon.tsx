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

const ClosePanelIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <g transform="translate(14.827 15.767) rotate(180)">
      <path
        fill={"currentcolor"}
        d="M-147.9-183c-4.1-4.1-10.8-4.1-14.9,0c0,0,0,0,0,0l-63.3,63.3c-4.1,4.1-4.1,10.8,0,14.9
		c0,0,0,0,0,0l63.3,63.3c4.1,4.1,10.8,4.1,14.9,0c4.1-4.1,4.1-10.8,0-14.9l-55.9-55.9l55.9-55.9C-143.7-172.2-143.7-178.9-147.9-183
		C-147.9-183-147.9-183-147.9-183L-147.9-183z"
      />
      <path
        fill={"currentcolor"}
        d="M-60.4-112.2c0-5.8-4.7-10.5-10.5-10.5h-137.1c-5.8,0-10.6,4.7-10.6,10.6
		c0,5.8,4.7,10.6,10.6,10.6h137.1C-65.1-101.7-60.4-106.4-60.4-112.2C-60.4-112.2-60.4-112.2-60.4-112.2z M-7.6,14.4
		c-5.8,0-10.5-4.7-10.5-10.5v-232.2c0-5.8,4.7-10.6,10.6-10.6c5.8,0,10.6,4.7,10.6,10.6V3.9C2.9,9.7-1.8,14.4-7.6,14.4L-7.6,14.4z"
      />
    </g>
  </svg>
);

export default ClosePanelIcon;
