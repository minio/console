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

const ComputerLineIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <g data-name="ComputerLineIcon">
        <path
          data-name="ComputerLineIcon"
          d="M19.678 227.007A19.678 19.678 0 0 1 0 207.328v-25.736h256.887v25.736a19.683 19.683 0 0 1-19.682 19.682Zm-4.844-19.682a4.541 4.541 0 0 0 4.541 4.541h218.289a4.541 4.541 0 0 0 4.541-4.541v-14.152h-75.387a12.4 12.4 0 0 1-11.354 7.567H101.5a12.416 12.416 0 0 1-11.355-7.567H14.836Zm204.662-40.871v-121.1H37.846v121.1H22.709V41.568a11.353 11.353 0 0 1 11.35-11.354h189.225a11.354 11.354 0 0 1 11.355 11.354v124.886Zm-166.516-.91V60.49h136.09l-11.957 12.108H65.093v92.945Z"
        />
        <path data-name="Rect\xE1ngulo 892" fill="none" d="M0 0h256v256H0z" />
      </g>
    </g>
  </svg>
);

export default ComputerLineIcon;
