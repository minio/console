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

const WarpIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 10"
    >
      <g transform="translate(43 439)">
        <path d="M27.5,10" transform="translate(-61 -439)" />
        <rect width="1.5" height="2" transform="translate(-43 -431)" />
        <rect width="1.5" height="6" transform="translate(-38.75 -435)" />
        <rect width="1.5" height="8" transform="translate(-36.625 -437)" />
        <rect width="1.5" height="4" transform="translate(-40.875 -433)" />
        <rect width="1.5" height="10" transform="translate(-34.5 -439)" />
        <path d="M18.5,10" transform="translate(-61 -439)" />
      </g>
    </svg>
  );
};

export default WarpIcon;
