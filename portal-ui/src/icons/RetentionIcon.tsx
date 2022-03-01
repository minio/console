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

const RetentionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <path
      d="M222.54,17.88h-24.4V14.76a12.2,12.2,0,1,0-24.4,0V17.9H78.93V14.76a12.21,12.21,0,1,0-24.41,0V17.9H33.42a30.46,30.46,0,0,0-30.88,30V223.47a30.54,30.54,0,0,0,30.88,30H222.56a30.47,30.47,0,0,0,30.86-29.94V47.9a30.53,30.53,0,0,0-30.88-30M26.94,47.79a6.27,6.27,0,0,1,6.45-6.08H54.52v3.34a12.21,12.21,0,0,0,24.39,0V41.71h94.81v3.34a12.2,12.2,0,0,0,24.4,0V41.71h24.4A6.28,6.28,0,0,1,229,47.77h0v26h-202ZM229.14,223.4a6.5,6.5,0,0,1-6.6,6.09H33.42A6.27,6.27,0,0,1,27,223.42h0V97.55H229.14Z"
      transform="translate(-2.54 -2.55)"
    />
    <path
      d="M96.62,195.15,128,200.61l31.36-5.46a16,16,0,0,0,16.41-15.05V148.49a16.05,16.05,0,0,0-16.85-15.05H148.22v-9.93a20.35,20.35,0,0,0-40.42,0v9.93H97.08a16.05,16.05,0,0,0-16.85,15.05v31.63a16,16,0,0,0,16.41,15M132,166.22v5.72a3.76,3.76,0,0,1-3.76,3.77h-.46a3.76,3.76,0,0,1-3.76-3.77h0v-5.72a7.13,7.13,0,1,1,9.9-1.92,7,7,0,0,1-1.92,1.92m-15.82-42.69a11.91,11.91,0,0,1,23.66,0v9.93H116.17Z"
      transform="translate(-2.54 -2.55)"
    />
  </svg>
);

export default RetentionIcon;
