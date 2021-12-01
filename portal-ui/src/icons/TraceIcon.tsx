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

const TraceIcon = (props: SVGProps<SVGSVGElement>) => (
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
        data-name="trace-icn"
        d="m28.428 74.404 56.9 62.738v110.977A8.062 8.062 0 0 1 77.154 256H65.065a8.082 8.082 0 0 1-8.189-7.881v-98.742L.003 82.287V7.879A8.036 8.036 0 0 1 8.16 0h12.105a8.043 8.043 0 0 1 8.166 7.879Zm56.9-66.525A8.061 8.061 0 0 0 77.154 0H65.065a8.081 8.081 0 0 0-8.189 7.879v71.315l56.921 67.091v101.834a8.045 8.045 0 0 0 8.166 7.881h12.1a8.058 8.058 0 0 0 8.157-7.881V134.051L85.331 71.322ZM134.059 0h-12.1a8.044 8.044 0 0 0-8.166 7.879v39.1a8.044 8.044 0 0 0 8.166 7.88h12.1a8.058 8.058 0 0 0 8.157-7.88v-39.1a8.057 8.057 0 0 0-8.16-7.88Zm44.783 118.856h12.105a8.05 8.05 0 0 0 8.166-7.88V7.876a8.049 8.049 0 0 0-8.166-7.879h-12.105a8.056 8.056 0 0 0-8.174 7.879v103.1a8.058 8.058 0 0 0 8.172 7.88ZM247.818-.001h-12.1a8.043 8.043 0 0 0-8.165 7.879v39.1a8.044 8.044 0 0 0 8.165 7.88h12.1a8.059 8.059 0 0 0 8.182-7.88v-39.1a8.058 8.058 0 0 0-8.182-7.879Zm0 173.715h-12.1a8.044 8.044 0 0 0-8.165 7.881v66.523a8.044 8.044 0 0 0 8.165 7.881h12.1a8.059 8.059 0 0 0 8.182-7.881v-66.519a8.058 8.058 0 0 0-8.182-7.884Zm0-82.286h-12.1a8.044 8.044 0 0 0-8.165 7.881v17.727l-56.889 56.678v74.4a8.057 8.057 0 0 0 8.174 7.881h12.105a8.05 8.05 0 0 0 8.166-7.881v-56.115l56.889-67.09v-25.6a8.059 8.059 0 0 0-8.18-7.881ZM20.262 137.142H8.157A8.038 8.038 0 0 0 0 145.022v103.1a8.037 8.037 0 0 0 8.157 7.881h12.105a8.044 8.044 0 0 0 8.166-7.881v-103.1a8.045 8.045 0 0 0-8.166-7.88Z"
      />
      <path data-name="Rect\xE1ngulo 880" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default TraceIcon;
