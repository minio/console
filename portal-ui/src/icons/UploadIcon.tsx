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

const UploadIcon = (props: SVGProps<SVGSVGElement>) => {
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
        <path
          data-name="Trazado 370"
          d="M-.001 109.548c0-20.969 32.832-20.969 32.832 0v114.558h190.344V109.548c0-20.969 32.824-20.969 32.824 0v130.505a16.188 16.188 0 01-16.41 15.945H16.41A16.188 16.188 0 010 240.053V109.548zm111.583 78.131c0 20.973 32.828 20.973 32.828 0V54.437l18.595 18.066c15.263 14.825 38.467-7.724 23.208-22.548L139.696 4.763a16.756 16.756 0 00-23.4 0L69.791 49.955c-15.259 14.823 7.945 37.373 23.208 22.548l18.589-18.066v133.242z"
        />
      </g>
    </svg>
  );
};

export default UploadIcon;
