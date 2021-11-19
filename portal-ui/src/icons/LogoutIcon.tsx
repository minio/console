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

const LogoutIcon = (props: SVGProps<SVGSVGElement>) => {
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
          data-name="Trazado 358"
          d="M183.841 0c21.633 0 21.633 32.9 0 32.9H65.693v190.737h118.148c21.633 0 21.633 32.89 0 32.89h-134.6a16.455 16.455 0 01-16.453-16.445V16.445A16.461 16.461 0 0149.241 0zM89.185 111.823c-21.609 0-21.609 32.89 0 32.89h79.539l-18.633 18.626c-15.3 15.3 7.961 38.545 23.242 23.258l46.628-46.616a16.441 16.441 0 000-23.442l-46.625-46.6c-15.281-15.3-38.547 7.952-23.242 23.249l18.633 18.636z"
        />
      </g>
    </svg>
  );
};

export default LogoutIcon;
