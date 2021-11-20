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

const WarpIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <path
        data-name="WarpIcon"
        d="M223.777 256c-4.293 0-7.777-3.137-7.777-7V7c0-3.868 3.484-7 7.777-7h24.445c4.295 0 7.777 3.132 7.777 7v242c0 3.862-3.482 7-7.777 7Zm-54 0c-4.293 0-7.777-3.137-7.777-7V60c0-3.868 3.484-7 7.777-7h24.445c4.295 0 7.777 3.132 7.777 7v189c0 3.862-3.482 7-7.777 7Zm-54 0c-4.293 0-7.777-3.137-7.777-7V111c0-3.868 3.484-7 7.777-7h24.445c4.295 0 7.777 3.132 7.777 7v138c0 3.862-3.482 7-7.777 7Zm-54 0c-4.293 0-7.777-3.137-7.777-7v-87c0-3.868 3.484-7 7.777-7h24.445c4.295 0 7.777 3.132 7.777 7v87c0 3.862-3.482 7-7.777 7Zm-54 0C3.484 256 0 252.863 0 249v-35c0-3.862 3.484-7 7.777-7h24.445c4.295 0 7.777 3.137 7.777 7v35c0 3.862-3.482 7-7.777 7Z"
      />
      <path data-name="Rect\xE1ngulo 922" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default WarpIcon;
