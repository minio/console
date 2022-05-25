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

const MetadataIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <path
      d="M234.64,2.55H64.58a9,9,0,0,0-8.95,8.94V92h44.75a9,9,0,0,1,8.94,8.94v125.3a9,9,0,0,1-8.94,8.95H55.63v8.94a9,9,0,0,0,8.95,8.94H234.64a9,9,0,0,0,9-8.94V11.49A9,9,0,0,0,234.64,2.55ZM198.78,208.4H136.13a9,9,0,1,1,0-17.9h62.65a9,9,0,0,1,0,17.9Zm0-35.8H136.13a9,9,0,0,1,0-17.9h62.65a8.95,8.95,0,0,1,0,17.9Zm0-35.8H136.13a9,9,0,1,1,0-17.9h62.65a9,9,0,0,1,0,17.9Zm0-35.8H136.13a9,9,0,1,1,0-17.9h62.65a9,9,0,0,1,0,17.9Zm0-35.81H100.33a8.95,8.95,0,0,1,0-17.9h98.45a8.95,8.95,0,0,1,0,17.9Z"
      transform="translate(-10.89 -2.55)"
    />
    <path
      d="M91.43,101H19.83a9,9,0,0,0-8.94,8.94v107.4a9,9,0,0,0,8.94,8.94h71.6a9,9,0,0,0,8.95-8.94V109.94A9,9,0,0,0,91.43,101Zm-17.9,98.44H37.73a8.95,8.95,0,1,1,0-17.9h35.8a8.95,8.95,0,0,1,0,17.9Zm0-26.84H37.73a8.95,8.95,0,1,1,0-17.9h35.8a8.95,8.95,0,0,1,0,17.9Zm0-26.85H37.73a8.95,8.95,0,1,1,0-17.9h35.8a8.95,8.95,0,0,1,0,17.9Z"
      transform="translate(-10.89 -2.55)"
    />
  </svg>
);

export default MetadataIcon;
