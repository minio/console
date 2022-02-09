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

const AzureTierIconXs = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      viewBox="0 0 22 17.043"
      {...props}
    >
      <g id="azure-logo-gray" transform="translate(-437.603 -471.382)">
        <g id="layer1-1" transform="translate(437.603 471.382)">
          <path
            id="path21"
            d="M447.781,487.513l5.188-.917.049-.011-2.668-3.173c-1.467-1.746-2.668-3.181-2.668-3.188s2.756-7.6,2.771-7.63c.006-.009,1.881,3.229,4.545,7.847l4.572,7.923.035.062-8.479,0-8.48,0S447.781,487.513,447.781,487.513Zm-10.178-.969s1.257-2.187,2.794-4.85l2.794-4.842,3.257-2.733c1.792-1.5,3.261-2.735,3.266-2.737a.672.672,0,0,1-.052.132c-.035.074-1.627,3.487-3.535,7.583l-3.472,7.448-2.525,0C438.739,486.551,437.6,486.55,437.6,486.544Z"
            transform="translate(-437.603 -471.382)"
          />
        </g>
      </g>
    </svg>
  );
};

export default AzureTierIconXs;
