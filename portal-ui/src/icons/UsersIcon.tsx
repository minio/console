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

const UsersIcon = (props: SVGProps<SVGSVGElement>) => {
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
          data-name="Trazado 331"
          d="M127.715 142.539a71.356 71.356 0 0071.279-71.27A71.356 71.356 0 00127.715 0a71.352 71.352 0 00-71.268 71.27 71.352 71.352 0 0071.268 71.269zm0-122.728a51.516 51.516 0 0151.463 51.458 51.514 51.514 0 01-51.463 51.458A51.5 51.5 0 0176.27 71.269a51.5 51.5 0 0151.445-51.458z"
        />
        <path
          data-name="Trazado 332"
          d="M214.632 199.929a108.81 108.81 0 00-41.184-32.75 110.263 110.263 0 00-51.553-10.2c-31.26 1.594-62.109 17.729-80.5 42.12a115.58 115.58 0 00-1.8 2.467 36.039 36.039 0 00-2.746 36.946c5.68 10.951 16.691 17.49 29.441 17.49h122.867c12.885 0 23.883-6.627 29.4-17.719a36.865 36.865 0 00-3.925-38.354zm-13.812 29.539c-1.529 3.065-4.8 6.726-11.662 6.726H66.286c-7.25 0-10.545-4.264-11.861-6.8a16.032 16.032 0 011.361-16.416c.473-.655.938-1.305 1.43-1.952 14.951-19.828 40.129-32.961 65.688-34.266 1.408-.069 2.816-.1 4.213-.1 27.5 0 55.287 13.533 71.729 35.236a17.146 17.146 0 011.974 17.569z"
        />
      </g>
    </svg>
  );
};

export default UsersIcon;
