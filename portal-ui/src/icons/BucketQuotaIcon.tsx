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

const BucketQuotaIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={"min-icon"}
    viewBox="0 0 256 256"
    {...props}
  >
    <defs>
      <clipPath id="clip-path">
        <rect
          id="Rectángulo_1024"
          data-name="Rectángulo 1024"
          width="256"
          height="255.998"
          fill="none"
        />
      </clipPath>
      <clipPath id="clip-Enable_Bucket_Quota">
        <rect width="256" height="256" />
      </clipPath>
    </defs>
    <g
      id="Enable_Bucket_Quota"
      data-name="Enable Bucket Quota"
      clipPath="url(#clip-Enable_Bucket_Quota)"
    >
      <rect width="256" height="256" fill="#fff" />
      <g id="Enable_Bucket_Quota_icon" data-name="Enable Bucket Quota icon">
        <g id="Grupo_2411" data-name="Grupo 2411">
          <path
            id="Trazado_7154"
            data-name="Trazado 7154"
            d="M250.852,8.773A21.516,21.516,0,0,0,233.731,0H22.263A21.507,21.507,0,0,0,5.148,8.773,25.866,25.866,0,0,0,.394,28.758c5.223,30.385,16.208,94.421,25,145.533l.015.1c4.457,26,8.336,48.644,10.616,61.787C37.988,247.665,47.17,256,57.875,256H198.129c10.712,0,19.873-8.33,21.859-19.818l10.59-61.711.077-.375,14.334-83.62.049-.243L255.6,28.758a25.8,25.8,0,0,0-4.748-19.985M37.855,98a9.546,9.546,0,0,1-9.408-7.931l-.007-.041a9.544,9.544,0,0,1,9.406-11.159H73.505A76.487,76.487,0,0,0,61.131,98ZM52.393,181.92a9.542,9.542,0,0,1-9.408-7.93l-.007-.041a9.543,9.543,0,0,1,9.406-11.158h9.537a76.056,76.056,0,0,0,13.085,19.123ZM95.5,184.747A65.491,65.491,0,0,1,166.073,74.4l-6.682,6.683a56.3,56.3,0,0,0-68.414,88.287h.016a56.4,56.4,0,0,0,68.255,8.755l6.7,6.7a65.481,65.481,0,0,1-70.445-.081m81.526-2.408-3.147-3.147L124.27,129.579l49.47-49.515,3.27-3.27,3.27,3.27a69.643,69.643,0,0,1,14.386,20.891q.409.909.789,1.828a70,70,0,0,1,0,53.585l.016-.013q-.46,1.113-.964,2.208A69.625,69.625,0,0,1,180.3,179.069Zm36.084-8.449h0a9.543,9.543,0,0,1-9.413,7.989l-11.062,0a80.263,80.263,0,0,0,11.888-18.775c.039-.085.079-.177.118-.264a9.542,9.542,0,0,1,8.469,11.047M227.4,89.971a9.542,9.542,0,0,1-9.414,7.989l-12.633,0c-.216-.509-.431-1.019-.659-1.526a80.169,80.169,0,0,0-10.75-17.566h24.04a9.544,9.544,0,0,1,9.416,11.1"
            transform="translate(0)"
          />
          <path
            id="Trazado_7155"
            data-name="Trazado 7155"
            d="M137.27,129.555,176.915,169.2a60.81,60.81,0,0,0,0-79.259Z"
            transform="translate(-0.011)"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default BucketQuotaIcon;
