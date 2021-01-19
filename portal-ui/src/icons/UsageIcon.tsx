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

import React from "react";
import { SvgIcon } from "@material-ui/core";

const UsageIcon = () => {
  return (
    <SvgIcon viewBox="0 0 16.172 17.187">
      <defs>
        <linearGradient
          id="a"
          y1="0.5"
          x2="1"
          y2="0.5"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0.044" stopColor="#362585" />
          <stop offset="0.301" stopColor="#281b6f" />
          <stop offset="1" stopColor="#1e1560" />
        </linearGradient>
      </defs>
      <path
        style={{
          fill: "none",
          stroke: "#707070",
          strokeMiterlimit: 10,
          strokeWidth: "0.5px",
        }}
        d="M-4778.1,2239.582v6.425h6.425"
        transform="translate(4787.594 -2239.582)"
      />
      <path
        fill={"#707070"}
        d="M-4784.238,2247.532v-.581c0-.027.009-.054.012-.081.039-.313.055-.632.121-.939a6.744,6.744,0,0,1,3.064-4.441,6.514,6.514,0,0,1,3.293-1.032,6.923,6.923,0,0,1,2.667.423,6.793,6.793,0,0,1,4.119,4.333,6.053,6.053,0,0,1,.279,1.337c.006.083.014.164.021.247v.86c-.011.131-.018.261-.032.392a6.494,6.494,0,0,1-.626,2.147,6.807,6.807,0,0,1-4.044,3.528,6.052,6.052,0,0,1-1.663.3,6.576,6.576,0,0,1-2.565-.325,6.73,6.73,0,0,1-3.947-3.451,6.627,6.627,0,0,1-.658-2.288C-4784.212,2247.816-4784.225,2247.674-4784.238,2247.532Zm13.025-.306c-.024-.309-.021-.661-.082-1a6.206,6.206,0,0,0-1.658-3.293,6.153,6.153,0,0,0-4.1-1.9,5.984,5.984,0,0,0-2.476.355,6.188,6.188,0,0,0-4.134,5.708,6.453,6.453,0,0,0,.228,1.881,6.127,6.127,0,0,0,1.984,3.052,6.046,6.046,0,0,0,3.806,1.445,6.043,6.043,0,0,0,1.235-.065,6.249,6.249,0,0,0,3.783-2.2,6.2,6.2,0,0,0,1.352-3.048C-4771.228,2247.863-4771.233,2247.563-4771.212,2247.226Z"
        transform="translate(4786.834 -2240.452)"
      />
      <ellipse
        style={{ opacity: 0.1, fill: "url(#a)" }}
        cx="6.151"
        cy="6.151"
        rx="6.151"
        ry="6.151"
        transform="translate(0 4.886)"
      />
    </SvgIcon>
  );
};

export default UsageIcon;
