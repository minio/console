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

import React, { SVGProps } from "react";

const EgressIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 18.344 17.009"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
    >
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
      <g transform="translate(0 0.25)">
        <ellipse
          style={{ opacity: 0.1, fill: "url(#a)" }}
          cx="7.462"
          cy="7.462"
          rx="7.462"
          ry="7.462"
          transform="translate(0 1.835)"
        />
        <rect
          style={{
            fill: "none",
            stroke: "#707070",
            strokeMiterlimit: 10,
            strokeWidth: "0.5px",
          }}
          width="9.323"
          height="9.323"
          transform="translate(4.083)"
        />
        <rect
          style={{
            fill: "none",
            stroke: "#707070",
            strokeMiterlimit: 10,
            strokeWidth: "0.5px",
          }}
          width="8.223"
          height="8.223"
          transform="translate(9.871 5.307)"
        />
      </g>
    </svg>
  );
};

export default EgressIcon;
