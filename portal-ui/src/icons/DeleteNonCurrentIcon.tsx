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

const DeleteNonCurrentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={"min-icon"}
    viewBox="0 0 256 256"
    fill={"currentcolor"}
    {...props}
  >
    <path d="M222.83,0H114.08a5.38,5.38,0,0,0-5.38,5.37V118.1c.62.39,1.24.79,1.85,1.2a74.53,74.53,0,0,1,22.09,100.36h90.19a5.36,5.36,0,0,0,5.37-5.37V5.37A5.37,5.37,0,0,0,222.83,0Z" />
    <path d="M106,125.38a68,68,0,1,0,30,56.35A67.59,67.59,0,0,0,106,125.38Zm8.16,94.78-7.77,7.76L68,189.5,29.56,227.92l-7.77-7.76,38.42-38.43L21.79,143.31l7.77-7.77L68,174l38.42-38.42,7.77,7.77L75.75,181.73Z" />
  </svg>
);

export default DeleteNonCurrentIcon;
