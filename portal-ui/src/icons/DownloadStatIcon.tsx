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

const DownloadStatIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <g data-name="DownloadStatIcon">
        <path
          data-name="Uni\xF3n 24"
          d="M0 127.996a128 128 0 0 1 128.008-128 128 128 0 0 1 128 128 128 128 0 0 1-128 128.009A128 128 0 0 1 0 127.996Zm20.484 0A107.643 107.643 0 0 0 128 235.52a107.633 107.633 0 0 0 107.512-107.523A107.631 107.631 0 0 0 128 20.487 107.641 107.641 0 0 0 20.48 127.996Zm98.063 71.518-32.336-32.338a13.192 13.192 0 0 1-3.172-14.743 14.934 14.934 0 0 1 13.3-9.235 13.542 13.542 0 0 1 9.637 4.224l8.563 8.554v-89.16c0-9.069 7.016-13.818 13.953-13.818 6.961 0 13.977 4.749 13.977 13.818v89.16l8.555-8.544a13.481 13.481 0 0 1 9.625-4.233 14.887 14.887 0 0 1 13.3 9.235 13.182 13.182 0 0 1-3.164 14.743l-32.348 32.348a14 14 0 0 1-9.906 4.155 14.085 14.085 0 0 1-9.988-4.166Z"
        />
        <path data-name="Rect\xE1ngulo 893" fill="none" d="M0 0h256v256H0z" />
      </g>
    </g>
  </svg>
);

export default DownloadStatIcon;
