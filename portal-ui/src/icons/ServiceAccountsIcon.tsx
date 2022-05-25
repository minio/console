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

const ServiceAccountsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 10 9.5"
    >
      <g transform="translate(231 719.516)">
        <path
          d="M-125.5,7.984a4.5,4.5,0,0,1,4.5-4.5,4.5,4.5,0,0,1,4.5,4.5Z"
          transform="translate(-105 -720)"
        />
        <rect width="10" height="1" transform="translate(-231 -711.016)" />
        <path
          d="M-119.5.484h-3v1h1v1h1v-1h1Z"
          transform="translate(-105 -720)"
        />
      </g>
    </svg>
  );
};

export default ServiceAccountsIcon;
