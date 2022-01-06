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

const MinIOTierIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      viewBox="0 0 24.858 50.321"
      {...props}
    >
      <path
        id="minio-logo-color"
        d="M50.1,20.478q-1.908-3.154-3.826-6.3c-.664-1.088-1.339-2.171-2.012-3.254l-.266-.393a4.682,4.682,0,0,0-6-1.913,4.208,4.208,0,0,0-1.936,5.674,10.029,10.029,0,0,0,1.714,2.129c1.924,2.044,3.91,4.031,5.818,6.089a6.008,6.008,0,0,1-2.092,9.664l-.128.052V22.652A31.007,31.007,0,0,0,32.4,29.6a30.255,30.255,0,0,0-7.034,13.992l6.481-3.3c2.155-1.1,4.295-2.172,6.532-3.308V55.447l2.984,3.027V35.425s.068-.032.292-.152a24.676,24.676,0,0,0,2.614-1.448,8.834,8.834,0,0,0,1.3-13.358c-2.216-2.318-4.443-4.626-6.656-6.946a1.424,1.424,0,0,1,0-2.128,1.47,1.47,0,0,1,2.138.12c.308.311,2.386,2.506,3.127,3.283q2.808,2.941,5.625,5.872a4.005,4.005,0,0,0,.311.266l.117-.069A1.864,1.864,0,0,0,50.1,20.478ZM38.375,33.551a.538.538,0,0,1-.273.364c-1.186.629-2.382,1.241-3.577,1.855C33.109,36.5,31.69,37.223,30.17,38a28.176,28.176,0,0,1,8.16-10.112l.053-.044C38.386,29.7,38.392,31.7,38.375,33.551Z"
        transform="translate(-25.369 -8.153)"
        fill="#c72c48"
      />
    </svg>
  );
};

export default MinIOTierIcon;
