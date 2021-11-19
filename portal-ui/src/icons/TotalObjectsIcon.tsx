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

const totalObjectsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 258.998 259"
    >
      <path
        data-name="total-objects-icn"
        d="M.498 129.502a129.147 129.147 0 01129-129 129.149 129.149 0 01129 129 129.146 129.146 0 01-129 129 129.143 129.143 0 01-129-129zm20 0a109.12 109.12 0 00109 109 109.124 109.124 0 00109-109 109.127 109.127 0 00-109-109 109.124 109.124 0 00-109 109zm27.77 31.828a37.9 37.9 0 0137.857-37.858 37.9 37.9 0 0137.854 37.858 37.9 37.9 0 01-37.854 37.858 37.9 37.9 0 01-37.857-37.86zm108.971 35.211a17.56 17.56 0 01-17.543-17.538v-37.989a17.565 17.565 0 0117.543-17.543h37.984a17.565 17.565 0 0117.543 17.543v37.989a17.56 17.56 0 01-17.543 17.538zm-55.309-81.945a13.4 13.4 0 01-11.566-6.676 13.412 13.412 0 010-13.353l27.07-46.884A13.392 13.392 0 01129 41.002a13.384 13.384 0 0111.564 6.681l27.07 46.884a13.383 13.383 0 010 13.353 13.4 13.4 0 01-11.566 6.676z"
        stroke="rgba(0,0,0,0)"
        strokeMiterlimit={10}
      />
    </svg>
  );
};

export default totalObjectsIcon;
