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

const EditTenantIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <g transform="translate(0 -0.853)">
      <path d="M89.25,173.48c-2.67-.25-5.25-1.12-7.54-2.52-2.52-2.16-3.51-5.62-2.52-8.78l7.55-35.2L204.84,8.87C210.17,4.17,216.73,1.09,223.76,0c7.06-.19,13.88,2.53,18.86,7.54,10.33,11.14,9.77,28.52-1.26,38.97l-116.9,118.1-33.94,7.55-1.26,1.25v.07Zm12.58-37.71l-5.04,20.12,20.13-5.03L231.28,36.46c4.78-4.21,5.34-11.46,1.26-16.35-2.52-2.52-5.03-3.77-7.54-2.52-3.34-.09-6.56,1.3-8.8,3.78l-114.39,114.39h.01Z" />
      <path d="M179.76,227.54H23.88C10.69,227.54,0,216.84,0,203.65V47.78c0-13.19,10.69-23.88,23.88-23.88H108.1v15.07H23.88c-4.46,.46-7.77,4.34-7.54,8.81V203.65c-.24,4.47,3.08,8.34,7.54,8.8H179.76c4.75,.12,8.69-3.63,8.81-8.38,0-.14,0-.28,0-.42v-49.03h16.33v49.03c-1.03,13.25-11.92,23.57-25.21,23.88h.07Z" />
    </g>
  </svg>
);

export default EditTenantIcon;
