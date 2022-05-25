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

const EgressIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <path
        data-name="Uni\xF3n 44"
        d="M68.023 254.27a84.932 84.932 0 0 1-16-4.981 85.034 85.034 0 0 1-14.469-7.867 85.9 85.9 0 0 1-12.605-10.417 86.052 86.052 0 0 1-10.4-12.633 85.293 85.293 0 0 1-7.857-14.5 84.868 84.868 0 0 1-4.965-16.024 86.347 86.347 0 0 1-1.732-17.194 85.284 85.284 0 0 1 4.422-27.2 84.814 84.814 0 0 1 12.285-23.571 85.562 85.562 0 0 1 18.707-18.5q2.35-1.7 4.787-3.216V19.084c0-5.291 2.291-9.882 6.814-13.658A23.864 23.864 0 0 1 62.7.001h101.867a23.167 23.167 0 0 1 15.266 5.427c4.512 3.771 6.807 8.362 6.813 13.648v55.263h47.275a23.173 23.173 0 0 1 15.264 5.427c4.512 3.775 6.8 8.367 6.813 13.648v108.21a17.675 17.675 0 0 1-6.812 14.023 23.153 23.153 0 0 1-15.248 5.421h-80.016a86.359 86.359 0 0 1-25.8 23.31 84.684 84.684 0 0 1-20.33 8.577 85.257 85.257 0 0 1-22.617 3.046 86.2 86.2 0 0 1-17.152-1.731ZM35.275 136.923a60 60 0 0 0-10.312 33.733A60.345 60.345 0 0 0 85.18 230.99a59.739 59.739 0 0 0 36.213-12.148 22.746 22.746 0 0 1-5.031-3.2 17.621 17.621 0 0 1-6.812-14.018v-54.893H62.71a23.732 23.732 0 0 1-15.7-5.431 17.831 17.831 0 0 1-6.568-10.988 60.318 60.318 0 0 0-5.167 6.61Zm100.654 60.824h94.119V97.293h-43.4v29.992a17.675 17.675 0 0 1-6.812 14.023 23.148 23.148 0 0 1-15.252 5.421H135.93Zm0-74.337H160.7V97.294h-24.771Zm-69.348 0h42.967V93.418c0-5.286 2.295-9.882 6.813-13.653a23.874 23.874 0 0 1 15.693-5.427H160.7V22.956H66.581Z"
      />
      <path data-name="Rect\xE1ngulo 926" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default EgressIcon;
