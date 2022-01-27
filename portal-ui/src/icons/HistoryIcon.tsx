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

const HistoryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <g>
      <path
        fill={"currentcolor"}
        d="M145.4,20C86.3,20.1,38.3,67.6,37.5,126.6L24.8,114c-5.2-5-13.4-4.9-18.5,0.2
		c-4.9,5.1-4.9,13.2,0,18.2l37,37c5.1,5.1,13.3,5.2,18.5,0.1c0,0,0.1-0.1,0.1-0.1l37-37c4.9-5.3,4.6-13.5-0.7-18.5
		c-5-4.7-12.8-4.7-17.8,0l-13.8,13.8c0.2-43.4,35.4-78.5,78.8-78.5c43.5,0,78.8,35.3,78.8,78.8c0,43.5-35.3,78.8-78.8,78.8
		c-8.1,0-14.6,6.5-14.6,14.6s6.5,14.6,14.6,14.6c59.6-0.1,107.8-48.4,107.9-107.9C253.4,68.5,205.1,20.1,145.4,20z"
      />
      <path
        fill={"currentcolor"}
        d="M150.7,81.1c0.2-1.5-0.3-3-1.2-4.2c-1.3-0.9-2.9-1.3-4.4-1.1h-7.4c-1.2-0.1-2.3,0.2-3.3,0.8
		c-0.9,1.1-1.4,2.5-1.2,4c0,18.9,0,37.8,0,56.6v0.9l40.4,40.4c0.6,0.7,1.4,1.3,2.3,1.5c1.2,0.1,2.5-0.4,3.4-1.2c2.7-2,5-4.4,7-7.1
		c0.9-0.9,1.3-2.1,1.2-3.4c-0.3-0.9-0.8-1.8-1.6-2.4l-29.6-29.4c-1.9-1.7-3.5-3.7-4.7-6c-1-2.8-1.3-5.7-1-8.6
		C150.9,108.3,150.9,94.7,150.7,81.1z"
      />
    </g>
  </svg>
);

export default HistoryIcon;
