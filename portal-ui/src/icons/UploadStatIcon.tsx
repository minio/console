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

const UploadStatIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <g data-name="UploadStatIcon">
        <path
          data-name="Uni\xF3n 27"
          d="M256 127.997a128.006 128.006 0 0 1-128 128.006A128.008 128.008 0 0 1 0 127.997a128.007 128.007 0 0 1 128.008-128 128 128 0 0 1 127.992 128Zm-20.477 0a107.649 107.649 0 0 0-107.52-107.52 107.641 107.641 0 0 0-107.52 107.52A107.635 107.635 0 0 0 128 235.513a107.642 107.642 0 0 0 107.523-107.516Zm-97.082-77.788 32.332 32.331a13.2 13.2 0 0 1 3.184 14.751 14.916 14.916 0 0 1-13.316 9.225 13.45 13.45 0 0 1-9.617-4.216l-8.559-8.565v89.178c0 9.072-7.035 13.8-13.977 13.8s-13.965-4.731-13.965-13.8V93.738l-8.547 8.565a13.5 13.5 0 0 1-9.637 4.216 14.917 14.917 0 0 1-13.3-9.225 13.216 13.216 0 0 1 3.18-14.751l32.344-32.331a13.916 13.916 0 0 1 9.9-4.168 14.021 14.021 0 0 1 9.978 4.169Z"
        />
        <path data-name="Rect\xE1ngulo 894" fill="none" d="M0 0h256v256H0z" />
      </g>
    </g>
  </svg>
);

export default UploadStatIcon;
