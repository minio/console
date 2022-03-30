// This file is part of MinIO Console Server
// Copyright (c) 2022 MinIO, Inc.
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

const FilterIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`min-icon`}
      fill={"currentcolor"}
      width="14"
      height="13.088"
      viewBox="0 0 14 13.088"
      {...props}
    >
      <g transform="translate(-231.827 -340.123)">
        <line className="a" x2="14" transform="translate(231.827 346.667)" />
        <g transform="translate(240.693 344.614)">
          <circle className="b" cx="2.053" cy="2.053" r="2.053" />
          <circle
            className="c"
            cx="1.597"
            cy="1.597"
            r="1.597"
            transform="translate(0.456 0.456)"
          />
        </g>
        <line className="a" x2="14" transform="translate(231.827 342.22)" />
        <g transform="translate(232.394 340.167)">
          <circle className="b" cx="2.053" cy="2.053" r="2.053" />
          <circle
            className="c"
            cx="1.597"
            cy="1.597"
            r="1.597"
            transform="translate(0.456 0.456)"
          />
        </g>
        <line className="a" x2="14" transform="translate(231.827 351.114)" />
        <g transform="translate(235.161 349.061)">
          <circle className="b" cx="2.053" cy="2.053" r="2.053" />
          <circle
            className="c"
            cx="1.597"
            cy="1.597"
            r="1.597"
            transform="translate(0.456 0.456)"
          />
        </g>
      </g>
    </svg>
  );
};

export default FilterIcon;
