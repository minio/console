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

const ProfileMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 12 10.456"
    {...props}
  >
    <defs>
      <clipPath id="clip-path-profile-menu-icon">
        <rect
          id="Rectángulo_1599"
          data-name="Rectángulo 1599"
          width="12"
          height="10.456"
          fill="#fff"
        />
      </clipPath>
    </defs>
    <g
      id="Grupo_2475"
      data-name="Grupo 2475"
      clipPath="url(#clip-path-profile-menu-icon)"
    >
      <path
        id="Trazado_7122"
        data-name="Trazado 7122"
        d="M33.036,1.016H43.058L43.3.207A.161.161,0,0,0,43.145,0h-10.2a.161.161,0,0,0-.154.207Z"
        transform="translate(-32.063)"
        fill="#fff"
      />
      <path
        id="Trazado_7123"
        data-name="Trazado 7123"
        d="M11.551,67.822H.449A.449.449,0,0,0,0,68.333l.644,4.659a.451.451,0,0,0,.018.078H11.334a.451.451,0,0,0,.018-.078L12,68.333a.449.449,0,0,0-.445-.511"
        transform="translate(0 -66.323)"
        fill="#fff"
      />
      <path
        id="Trazado_7124"
        data-name="Trazado 7124"
        d="M16.471,328.2H5.652a.476.476,0,0,0-.452.624l.845,2.576H16.078l.845-2.576a.476.476,0,0,0-.452-.624"
        transform="translate(-5.062 -320.942)"
        fill="#fff"
      />
    </g>
  </svg>
);

export default ProfileMenuIcon;
