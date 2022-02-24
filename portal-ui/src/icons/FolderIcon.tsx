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

const FolderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <g>
      <path
        d="M235.3,72.5c-0.2-15.5-12.8-27.9-28.3-27.9h-78l-1.1-1.5c-5.1-9.3-14.5-15.5-25.1-16.6h-50c-15.6,0-28.3,12.6-28.3,28.3
			c0,1,0.1,2,0.2,3v12.9c-11.6,3.9-19.4,14.8-19.4,27c0,0.6,0,1.2,0.1,1.7L14.8,202c0.6,15.4,13.2,27.5,28.6,27.5h168.9
			c15.4,0,28-12.1,28.6-27.5l9.5-102.5c0-0.6,0.1-1.2,0.1-1.8C250.6,87.1,244.7,77.4,235.3,72.5z M32.5,88.4c11.7-3.3,12-11,12-11
			h172c0.2,4.6,2.9,8.8,6.9,11H32.5z"
      />
    </g>
  </svg>
);

export default FolderIcon;
