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

const CancelledIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <path d="M126.09,0C56.45,0,0,56.45,0,126.09s56.45,126.09,126.09,126.09,126.09-56.45,126.09-126.09S195.72,0,126.09,0Zm79.61,146.23H46.48c-11.08,0-20.14-9.07-20.14-20.14h0c0-11.08,9.07-20.14,20.14-20.14H205.7c11.08,0,20.14,9.07,20.14,20.14h0c0,11.08-9.07,20.14-20.14,20.14Z" />
  </svg>
);

export default CancelledIcon;
