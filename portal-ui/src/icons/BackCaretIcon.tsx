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

import * as React from "react";
import { SVGProps } from "react";

const BackCaretIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <g id="noun_chevron_2320228" transform="translate(5.595 10) rotate(180)">
      <path
        id="Path_6842"
        d="M-178.01,7.8c-3.9-0.03-7.62-1.63-10.34-4.43c-5.81-5.68-5.92-15-0.25-20.81
		c0.08-0.08,0.16-0.16,0.25-0.25l100.13-100.13l-100.13-100.48c-5.81-5.68-5.92-15-0.25-20.81c0.08-0.08,0.16-0.16,0.25-0.25
		c5.68-5.81,15-5.92,20.81-0.25c0.08,0.08,0.16,0.16,0.25,0.25l110.82,110.82c2.8,2.72,4.39,6.44,4.43,10.34
		c0.11,3.93-1.51,7.71-4.43,10.34L-167.29,2.99C-170.07,5.97-173.93,7.71-178.01,7.8z"
      />
    </g>
  </svg>
);

export default BackCaretIcon;
