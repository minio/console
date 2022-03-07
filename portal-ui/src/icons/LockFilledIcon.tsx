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

const LockFilledIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      id="Path_7819"
      data-name="Path 7819"
      d="M9.884,3.523H8.537V2.27A2.417,2.417,0,0,0,6,0,2.417,2.417,0,0,0,3.463,2.27V3.523H2.116A2.019,2.019,0,0,0,0,5.423V9.413a2.012,2.012,0,0,0,2.062,1.9L6,12l3.938-.688A2.012,2.012,0,0,0,12,9.413V5.423a2.019,2.019,0,0,0-2.116-1.9M6.5,7.658v.724a.474.474,0,0,1-.472.474H5.971A.474.474,0,0,1,5.5,8.381V7.658a.9.9,0,0,1-.394-.744h0a.894.894,0,1,1,1.4.744m.985-4.135H4.514V2.27A1.416,1.416,0,0,1,6,.94,1.416,1.416,0,0,1,7.486,2.27Z"
      fill="#071d43"
    />
  </svg>
);

export default LockFilledIcon;
