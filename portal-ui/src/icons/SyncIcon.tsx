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

const SyncIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <path data-name="Rect\xE1ngulo 849" fill="none" d="M0 0h256v256H0z" />
      <path
        data-name="sync-icn"
        d="M37.848 131.79c0-.057.006-.114.006-.166l-5.4 6.524-9.992 11.438c-11.006 12.6-30.166-4.136-19.16-16.739l33.545-38.416a12.732 12.732 0 0 1 18.1-1.222l38.41 33.549c12.6 11.006-4.133 30.171-16.74 19.165l-14.342-12.527-2.316-2.123c0 .175.023.346.023.517a73.159 73.159 0 0 0 73.078 73.078 73.28 73.28 0 0 0 59.584-30.763 11.067 11.067 0 0 1 15.432-2.6 11.062 11.062 0 0 1 2.6 15.432 95.45 95.45 0 0 1-77.611 40.059 95.316 95.316 0 0 1-95.217-95.206Zm163.207 21.989-38.4-33.549c-12.6-11.011 4.131-30.176 16.738-19.17l14.338 12.532 2.32 2.118c0-.171-.023-.336-.023-.512A73.159 73.159 0 0 0 122.95 42.12a73.289 73.289 0 0 0-59.588 30.759 11.068 11.068 0 0 1-15.432 2.6 11.071 11.071 0 0 1-2.6-15.431 95.439 95.439 0 0 1 77.615-40.06 95.317 95.317 0 0 1 95.209 95.209c0 .057-.01.109-.01.166l5.4-6.529 9.992-11.433c11.006-12.6 30.17 4.136 19.16 16.739l-33.545 38.415a12.894 12.894 0 0 1-9.689 4.43 12.7 12.7 0 0 1-8.407-3.205Z"
        stroke="rgba(0,0,0,0)"
        strokeMiterlimit={10}
      />
    </g>
  </svg>
);

export default SyncIcon;
