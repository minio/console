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

const BucketEncryptionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={"min-icon"}
    viewBox="0 0 256 256"
    fill={"currentcolor"}
    {...props}
  >
    <defs>
      <clipPath id="clip-path">
        <rect
          id="Rectángulo_1023"
          data-name="Rectángulo 1023"
          width="256"
          height="255.998"
          fill="none"
        />
      </clipPath>
      <clipPath id="clip-Enable_Bucket_Encryption">
        <rect width="256" height="256" />
      </clipPath>
    </defs>
    <g
      id="Enable_Bucket_Encryption"
      data-name="Enable Bucket Encryption"
      clipPath="url(#clip-Enable_Bucket_Encryption)"
    >
      <rect width="256" height="256" fill="#fff" />
      <g
        id="Enable_Bucket_Encryption_Icon"
        data-name="Enable Bucket Encryption Icon"
      >
        <g id="Grupo_2410" data-name="Grupo 2410">
          <path
            id="Trazado_7149"
            data-name="Trazado 7149"
            d="M127.927,130.84a8.009,8.009,0,0,0-4.486,14.645v6.451a4.238,4.238,0,0,0,4.228,4.228h.511a4.237,4.237,0,0,0,4.227-4.228v-6.451a8.009,8.009,0,0,0-4.48-14.645"
            transform="translate(-0.009)"
          />
          <path
            id="Trazado_7150"
            data-name="Trazado 7150"
            d="M250.852,8.773A21.516,21.516,0,0,0,233.732,0H22.264A21.507,21.507,0,0,0,5.148,8.773,25.864,25.864,0,0,0,.395,28.759c5.223,30.384,16.208,94.421,25,145.533l.014.1c4.457,26,8.337,48.644,10.616,61.787C37.988,247.666,47.17,256,57.875,256H198.129c10.712,0,19.873-8.332,21.859-19.818l10.591-61.712.076-.375,14.334-83.619.049-.243L255.6,28.759a25.8,25.8,0,0,0-4.748-19.986M37.855,98a9.544,9.544,0,0,1-9.408-7.93l-.007-.042a9.544,9.544,0,0,1,9.406-11.158h62.969A29.6,29.6,0,0,0,94.2,97.433v.176h-1.06a32.022,32.022,0,0,0-4.912.382Zm14.538,83.918a9.544,9.544,0,0,1-9.408-7.93l-.007-.041a9.544,9.544,0,0,1,9.405-11.159H63.256a26.924,26.924,0,0,0,8.909,18.292q.468.428.952.833ZM181.632,161.14c0,9.2-8.235,16.705-18.456,16.935l-35.261,6.136-35.259-6.135C82.434,177.844,74.2,170.337,74.2,161.14V125.55c0-9.342,8.5-16.941,18.943-16.941H105.2V97.433c0-11.162,10.19-20.244,22.714-20.244s22.714,9.08,22.714,20.244v11.176h12.059c10.446,0,18.944,7.6,18.944,16.941Zm31.479,12.751h0a9.543,9.543,0,0,1-9.413,7.989l-20.95.006c.311-.262.618-.529.918-.8a26.921,26.921,0,0,0,8.91-18.292H203.7a9.544,9.544,0,0,1,9.415,11.1M227.4,89.972a9.544,9.544,0,0,1-9.414,7.989l-50.5.012a32.024,32.024,0,0,0-4.8-.364h-1.06v-.176a29.6,29.6,0,0,0-6.613-18.56h62.97a9.544,9.544,0,0,1,9.416,11.1"
            transform="translate(0)"
          />
          <path
            id="Trazado_7151"
            data-name="Trazado 7151"
            d="M127.923,85.575c-7.334,0-13.3,5.32-13.3,11.858l0,11.175h26.61l0-11.175c0-6.538-5.967-11.858-13.3-11.858"
            transform="translate(-0.009)"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default BucketEncryptionIcon;
