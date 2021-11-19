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

const TraceIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 0h256v256H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)">
        <path
          data-name="trace-icn"
          d="M28.428 74.199l56.9 62.563v110.667a8.052 8.052 0 01-8.174 7.859H65.065a8.071 8.071 0 01-8.189-7.859v-98.468L.003 82.061v-74.2A8.026 8.026 0 018.16.004h12.105a8.033 8.033 0 018.166 7.857zm56.9-66.34A8.051 8.051 0 0077.154.002H65.065a8.07 8.07 0 00-8.189 7.857v71.116l56.921 66.9v101.554a8.034 8.034 0 008.166 7.859h12.1a8.048 8.048 0 008.157-7.859v-113.75L85.331 71.124zM134.059.002h-12.1a8.033 8.033 0 00-8.166 7.857v38.987a8.034 8.034 0 008.166 7.858h12.1a8.048 8.048 0 008.157-7.858V7.859a8.047 8.047 0 00-8.16-7.86zm44.783 118.525h12.105a8.04 8.04 0 008.166-7.858V7.859a8.038 8.038 0 00-8.166-7.857h-12.105a8.046 8.046 0 00-8.174 7.857v102.81a8.047 8.047 0 008.172 7.856zM247.818-.001h-12.1a8.033 8.033 0 00-8.165 7.857v38.987a8.034 8.034 0 008.165 7.858h12.1A8.048 8.048 0 00256 46.843V7.856a8.048 8.048 0 00-8.182-7.857zm0 173.231h-12.1a8.033 8.033 0 00-8.165 7.859v66.338a8.034 8.034 0 008.165 7.859h12.1a8.049 8.049 0 008.182-7.859v-66.338a8.048 8.048 0 00-8.182-7.858zm0-82.058h-12.1a8.034 8.034 0 00-8.165 7.859v17.678l-56.889 56.521v74.2a8.047 8.047 0 008.174 7.859h12.105a8.039 8.039 0 008.166-7.859v-55.964l56.889-66.9V99.038a8.049 8.049 0 00-8.18-7.864zM20.262 136.759H8.157A8.027 8.027 0 000 144.617v102.81a8.027 8.027 0 008.157 7.859h12.105a8.034 8.034 0 008.166-7.859V144.619a8.034 8.034 0 00-8.166-7.858z"
        />
      </g>
    </svg>
  );
};

export default TraceIcon;
