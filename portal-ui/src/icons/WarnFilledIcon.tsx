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

const WarnFilledIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      id="WarnFilledIcon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 12 12"
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
    >
      <defs>
        <clipPath id="clip-path">
          <rect
            id="Rectangle_987"
            data-name="Rectangle 987"
            width="12"
            height="12"
          />
        </clipPath>
      </defs>
      <g id="warning-icon-full" transform="translate(-0.002 -0.003)">
        <g
          id="Group_2356"
          data-name="Group 2356"
          transform="translate(0.002 0.003)"
          clip-path="url(#clip-path)"
        >
          <path
            id="Path_7081"
            data-name="Path 7081"
            d="M6,0H6a6,6,0,1,0,6,6A6,6,0,0,0,6,0m.964,1.947L6.751,7.434H5.318L5.1,1.947ZM6.04,10.454a1.134,1.134,0,1,1,0-2.269,1.134,1.134,0,0,1,0,2.269"
            transform="translate(-0.002 -0.003)"
          />
        </g>
      </g>
    </svg>
  );
};

export default WarnFilledIcon;
