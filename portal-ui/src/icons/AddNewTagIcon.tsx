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

const AddNewTagIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={"min-icon"}
    viewBox="0 0 256 256"
    {...props}
  >
    <g>
      <g transform="translate(0 7.836)">
        <g>
          <path
            d="M227.22,126.576A53.114,53.114,0,1,0,155.674,55.03L109.365,8.722A29.86,29.86,0,0,0,88.94,0L29.97.032A30.021,30.021,0,0,0,0,29.99l0,59.2a29.8,29.8,0,0,0,8.7,20.186L133.237,233.909a29.806,29.806,0,0,0,21.266,8.758v0a29.813,29.813,0,0,0,21.25-8.743l58.162-58.157a30.211,30.211,0,0,0-.018-42.511ZM60.958,76.033A15.072,15.072,0,1,1,76.031,60.96,15.091,15.091,0,0,1,60.958,76.033m100.274,3.334A41.967,41.967,0,1,1,203.2,121.334a41.967,41.967,0,0,1-41.967-41.967"
            fill="#4ccb92"
          />
          <path
            d="M316.362,94.258H303.2v13.164H290.033v13.165H303.2v13.165h13.164V120.587h13.164V107.422H316.362Z"
            transform="translate(-106.58 -34.638)"
            fill="#4ccb92"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default AddNewTagIcon;
