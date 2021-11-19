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

const ReportedUsageIcon = (props: SVGProps<SVGSVGElement>) => {
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
      <g data-name="Reported Usage" clipPath="url(#prefix__a)">
        <path
          data-name="Trazado 390"
          d="M128.218 1A127.366 127.366 0 00.999 128.219 127.363 127.363 0 00128.218 255.43a127.361 127.361 0 00127.213-127.211A127.364 127.364 0 00128.218 1zm0 221.711a94.6 94.6 0 01-94.5-94.492 94.608 94.608 0 0194.5-94.5v94.5h94.49a94.6 94.6 0 01-94.49 94.492z"
        />
      </g>
    </svg>
  );
};

export default ReportedUsageIcon;
