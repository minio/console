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

import React, { SVGProps } from "react";

const BackIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      {...props}
      viewBox="0 0 18 12"
    >
      <defs />
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g fill={"currentcolor"} id="Fill-2">
          <polygon points="17.9999987 4.99999934 3.82999951 4.99999934 7.40999918 1.4099994 5.99999946 -3.60000001e-07 -1.80000029e-07 5.99999928 5.99999946 11.9999989 7.40999918 10.5899991 3.82999951 6.99999922 17.9999987 6.99999922"></polygon>
        </g>
      </g>
    </svg>
  );
};

export default BackIcon;
