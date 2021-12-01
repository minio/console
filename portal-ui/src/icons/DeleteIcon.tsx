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

const DeleteIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <defs>
      <clipPath id="prefix__a">
        <path d="M0 0h256v256H0z" />
      </clipPath>
    </defs>
    <g clipPath="url(#prefix__a)">
      <path fill="none" d="M0 0h256v256H0z" />
      <g data-name="Grupo 1557">
        <path data-name="Rect\xE1ngulo 826" fill="none" d="M0 0h256v256H0z" />
        <path
          data-name="Uni\xF3n 10"
          d="M71.113 256a37.94 37.94 0 0 1-37.889-37.9V60.906a15.426 15.426 0 0 1-14.227-15.353V29.621a15.423 15.423 0 0 1 15.4-15.4h41.541A15.378 15.378 0 0 1 91.258.003h72.871a15.393 15.393 0 0 1 15.334 14.218h41.531a15.423 15.423 0 0 1 15.4 15.4v15.932a15.426 15.426 0 0 1-14.227 15.353V218.1a37.942 37.942 0 0 1-37.9 37.9Zm-19.605-37.9a19.634 19.634 0 0 0 19.605 19.614h113.164A19.637 19.637 0 0 0 203.89 218.1V60.951H51.507ZM218.117 38.6v-6.1h-56.893V18.278H94.177V32.5H37.286v6.1Z"
        />
      </g>
    </g>
  </svg>
);

export default DeleteIcon;
