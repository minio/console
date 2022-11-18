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

const TierOnlineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
  >
    <path
      id="online-icon"
      d="M7,14a7.052,7.052,0,0,1-1.411-.142,6.962,6.962,0,0,1-2.5-1.053A7.02,7.02,0,0,1,.55,9.725,6.965,6.965,0,0,1,.142,8.411a7.068,7.068,0,0,1,0-2.821A6.962,6.962,0,0,1,1.2,3.086,7.02,7.02,0,0,1,4.275.55,6.965,6.965,0,0,1,5.589.142a7.068,7.068,0,0,1,2.821,0,6.962,6.962,0,0,1,2.5,1.053,7.02,7.02,0,0,1,2.536,3.08,6.965,6.965,0,0,1,.408,1.314,7.068,7.068,0,0,1,0,2.821,6.962,6.962,0,0,1-1.053,2.5,7.02,7.02,0,0,1-3.08,2.536,6.965,6.965,0,0,1-1.314.408A7.052,7.052,0,0,1,7,14ZM3.958,6h0L2.953,7.008l3.016,3.016L10.995,5,9.99,3.992,5.969,8.013,3.958,6Z"
      fill="#4ccb92"
    />
  </svg>
);

export default TierOnlineIcon;
