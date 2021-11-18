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

const EditIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 0h256v256H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)">
        <path d="M202.19 0a56.615 56.615 0 00-38.958 15.872L18.945 160.159a13.233 13.233 0 00-3.848 7.214L.188 239.998a13.364 13.364 0 003.848 12.5 14.606 14.606 0 0010.1 3.848 6.1 6.1 0 002.886-.481l72.144-13.948a13.233 13.233 0 007.214-3.848L240.666 93.788c21.162-21.162 21.162-56.272 0-77.434A53.11 53.11 0 00202.19 0zM51.65 221.24a29.925 29.925 0 00-6.733-9.138 40.721 40.721 0 00-9.138-6.733l5.291-25.01a46.19 46.19 0 0123.567 12.024 42.742 42.742 0 0112.024 23.567zm169.3-147.173L92.532 202.002a56.341 56.341 0 00-14.91-23.086 65.746 65.746 0 00-23.086-14.91L182.952 35.588a26.488 26.488 0 0119.238-7.7 28.6 28.6 0 0119.238 7.7 27.744 27.744 0 01-.481 38.479z" />
      </g>
    </svg>
  );
};

export default EditIcon;
