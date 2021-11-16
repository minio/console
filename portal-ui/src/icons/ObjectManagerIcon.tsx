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

const ObjectManagerIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <g id="Layer 1">
        <path
          d="M217.452+193.452L217.452+224.458L38.4601+224.458L38.4601+193.452L0.104767+193.452L0.104767+255.464L255.807+255.464L255.807+193.452L217.452+193.452Z"
          opacity="1"
        />
        <path
          d="M70.1156+194.746L98.6658+194.746L98.6658+97.0605L120.994+97.0605L84.3907+51.995L47.7878+97.0605L70.1156+97.0605L70.1156+194.746Z"
          opacity="1"
        />
        <path
          d="M183.757+52.6023L155.207+52.6922L155.515+150.377L133.187+150.448L169.932+195.398L206.392+150.217L184.065+150.288L183.757+52.6023Z"
          opacity="1"
        />
      </g>
    </svg>
  );
};

export default ObjectManagerIcon;
