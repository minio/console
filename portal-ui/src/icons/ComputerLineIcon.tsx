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

import React, { SVGProps } from "react";

const ComputerLineIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 38.888 29.791"
    >
      <g id="computer-line" transform="translate(-1 -5)">
        <path
          d="M9.833,24.9V10.833H26.791L28.6,9H8V24.9Z"
          transform="translate(1.021 0.583)"
        />
        <path
          d="M6.292,7.292h27.5V25.624h2.292V6.719A1.719,1.719,0,0,0,34.363,5H5.719A1.719,1.719,0,0,0,4,6.719V25.624H6.292Z"
          transform="translate(0.437)"
        />
        <path
          d="M1,25v3.9a2.979,2.979,0,0,0,2.979,2.979h32.93A2.979,2.979,0,0,0,39.888,28.9V25Zm36.665,3.9a.687.687,0,0,1-.687.687H3.933a.687.687,0,0,1-.687-.687V26.753h11.4A1.879,1.879,0,0,0,16.365,27.9h8.169a1.879,1.879,0,0,0,1.719-1.146H37.665Z"
          transform="translate(0 2.916)"
        />
      </g>
    </svg>
  );
};

export default ComputerLineIcon;
