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

const UserFilledIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 9.008 12"
    {...props}
  >
    <defs>
      <clipPath id="clip-path">
        <rect
          id="Rectangle_991"
          data-name="Rectangle 991"
          width="9.008"
          height="12"
          fill="#071d43"
        />
      </clipPath>
    </defs>
    <g id="Group_2365" data-name="Group 2365">
      <path
        id="Path_7088"
        data-name="Path 7088"
        d="M26.843,6.743a3.4,3.4,0,0,0,3.411-3.372,3.411,3.411,0,0,0-6.822,0,3.4,3.4,0,0,0,3.411,3.372"
        transform="translate(-22.334)"
        fill="#071d43"
      />
      <path
        id="Path_7089"
        data-name="Path 7089"
        d="M8.639,157.057a5.164,5.164,0,0,0-1.957-1.538,5.438,5.438,0,0,0-1.083-.362,5.2,5.2,0,0,0-1.117-.123c-.075,0-.151,0-.225.005H4.231a4.928,4.928,0,0,0-.549.059,5.236,5.236,0,0,0-3.276,1.92c-.029.039-.059.078-.086.116h0a1.723,1.723,0,0,0-.134,1.784,1.583,1.583,0,0,0,.255.356,1.559,1.559,0,0,0,.337.267,1.613,1.613,0,0,0,.4.167,1.742,1.742,0,0,0,.449.058H7.389a1.747,1.747,0,0,0,.452-.058,1.593,1.593,0,0,0,.4-.169,1.524,1.524,0,0,0,.335-.271,1.548,1.548,0,0,0,.251-.361,1.761,1.761,0,0,0-.191-1.85"
        transform="translate(0.001 -147.766)"
        fill="#071d43"
      />
    </g>
  </svg>
);

export default UserFilledIcon;
