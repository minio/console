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
      <g>
        <g x="2.7" y="36.8">
          <path
            d="M77.2,168.6c4,4.1,10.6,4.3,14.7,0.3c0,0,0,0,0.1-0.1l0.2-0.2l29.7-29.9
			c3.9-4.3,3.6-10.9-0.7-14.9c-4-3.7-10.1-3.7-14.1-0.1l-12,12V47.3h0.1c0-5.8-4.7-10.5-10.5-10.5s-10.5,4.7-10.5,10.5v88.3
			l-11.9-12c-4.3-4-10.9-3.7-14.9,0.5c-3.8,4.1-3.8,10.4,0.1,14.4L77.2,168.6z"
          />
          <path
            d="M148.3,84.9l11.9-12v88.3h-0.1c0,5.8,4.7,10.5,10.5,10.5s10.5-4.7,10.5-10.5V72.9l11.9,12
			c4.3,4,10.9,3.7,14.9-0.5c3.8-4.1,3.8-10.4-0.1-14.4l-29.7-30c-4-4.1-10.6-4.2-14.7-0.2l-0.2,0.2l-29.7,29.9
			c-4,4.2-3.8,10.9,0.4,14.9C138.1,88.6,144.3,88.7,148.3,84.9"
          />
          <path
            d="M242.1,154.9c-6.2,0-11.2,5-11.2,11.1l0,0v27.4c0,1.9-1.6,3.5-3.5,3.5H28.5
			c-1.9,0-3.5-1.6-3.5-3.5v-27.3c0.2-6.2-4.7-11.3-10.8-11.5s-11.3,4.7-11.5,10.8c0,0.2,0,0.4,0,0.7v27.4
			c0,14.2,11.6,25.7,25.8,25.8h198.8c14.2,0,25.8-11.6,25.8-25.8v-27.4C253.1,159.9,248.1,154.9,242.1,154.9L242.1,154.9"
          />
        </g>
      </g>
    </svg>
  );
};

export default ObjectManagerIcon;
