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

import React, { SVGProps } from "react";

const EnabledIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      viewBox="0 0 16 16"
      {...props}
    >
      <g>
        <path d="M8,0a8,8,0,1,0,8,8A8,8,0,0,0,8,0m4.575,5.769-.005.005L7.837,11.69a.89.89,0,0,1-.635.284H7.185a.889.889,0,0,1-.628-.26h0L3.421,8.577a.889.889,0,1,1,1.2-1.31q.028.025.053.053L7.16,9.8l4.117-5.246.024-.026h0a.889.889,0,0,1,1.275,1.24" />
      </g>
    </svg>
  );
};

export default EnabledIcon;
