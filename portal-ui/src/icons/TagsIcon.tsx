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

const TagsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <path
      d="M8.18,94.43V21.24A20.26,20.26,0,0,1,27.69,1.74h73.19A51,51,0,0,1,134.25,15.6L242.6,136.2a21,21,0,0,1,0,27.73l-84.8,84.81a20.17,20.17,0,0,1-27.74,0L22.05,127.8A55.46,55.46,0,0,1,8.18,94.43ZM39.94,52.24a19.31,19.31,0,0,0,18.7,18.94A19.42,19.42,0,0,0,77.58,52.24,19.29,19.29,0,0,0,58.64,33.53,19.17,19.17,0,0,0,39.94,52.24Z"
      transform="translate(-8.18 -1.74)"
    />
  </svg>
);

export default TagsIcon;
