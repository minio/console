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

const DownloadIcon = (props: SVGProps<SVGSVGElement>) => {
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
          data-name="Trazado 362"
          d="M0 104.121c0-21.583 32.822-21.583 32.822 0v117.917h190.356V104.121c0-21.583 32.822-21.583 32.822 0v134.338a16.416 16.416 0 01-16.4 16.413H16.415A16.421 16.421 0 01.002 238.459V104.121zm144.415-85.112c0-21.574-32.826-21.574-32.826 0v137.162l-18.591-18.6c-15.263-15.267-38.474 7.945-23.211 23.211l46.51 46.518a16.427 16.427 0 0023.406 0l46.507-46.518c15.266-15.266-7.945-38.478-23.208-23.211l-18.587 18.6V19.009z"
        />
      </g>
    </svg>
  );
};

export default DownloadIcon;
