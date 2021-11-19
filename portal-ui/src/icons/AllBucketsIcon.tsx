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

const AllBucketsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 15.834 17.375"
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
      <g transform="translate(0 0.375)">
        <circle
          style={{ opacity: 0.1, fill: "url(#a)" }}
          cx="6.625"
          cy="6.625"
          r="6.625"
          transform="translate(0 3.75)"
        />
        <g transform="translate(3.092)">
          <ellipse
            style={{
              fill: "none",
              stroke: "#707070",
              strokeMiterlimit: 10,
              strokeWidth: "0.75px",
            }}
            cx="6.183"
            cy="1.244"
            rx="6.183"
            ry="1.244"
            transform="translate(0)"
          />
          <path
            style={{
              fill: "none",
              stroke: "#707070",
              strokeMiterlimit: 10,
              strokeWidth: "0.75px",
            }}
            d="M-3722.174,1225.225l-1.687,10.292a.858.858,0,0,1-.578.669,12.182,12.182,0,0,1-3.918.647,12.187,12.187,0,0,1-3.894-.639.878.878,0,0,1-.6-.678q-.843-5.145-1.687-10.291"
            transform="translate(3734.541 -1223.981)"
          />
        </g>
      </g>
    </svg>
  );
};

export default AllBucketsIcon;
