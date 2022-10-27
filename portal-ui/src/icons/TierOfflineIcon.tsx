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

const TierOfflineIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 14 14"
  >
    <path
      id="offline-icon"
      d="M91.4,4.551l-.825-.825-2.44,2.439L85.7,3.726l-.825.825L87.312,6.99,84.873,9.429l.825.825,2.439-2.439,2.44,2.439.825-.825L88.961,6.99Zm-.155,9.44H85.027l-3.89-4.279V4.269L85.027-.01h6.219l3.89,4.279V9.711Z"
      transform="translate(-81.136 0.01)"
      fill="#c83b51"
      fill-rule="evenodd"
    />
  </svg>
);

export default TierOfflineIcon;
