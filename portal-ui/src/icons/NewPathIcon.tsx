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

const NewPathIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <g>
      <path
        d="M23.4,121.5c-11.5,0-21.4,9.8-21.4,21.2c0.2,11.8,9.7,21.2,21.4,21.4
				c11.4,0,21.2-9.9,21.2-21.4C44.3,131.1,35,121.7,23.4,121.5"
      />
      <path
        d="M23.4,175.4c-11.5,0-21.4,9.8-21.4,21.2c0.2,11.8,9.7,21.2,21.4,21.4
				c11.4,0,21.2-9.9,21.2-21.4C44.3,184.9,35,175.6,23.4,175.4"
      />
      <path
        d="M158.6,40.2h-12.2c-4.3,0-8.3,2.5-10.2,6.4l-76.6,157c-2.7,5.6-0.4,12.4,5.2,15.2
				c1.6,0.8,3.3,1.2,5,1.2H82c4.3,0,8.3-2.5,10.2-6.4l76.6-157c2.7-5.6,0.4-12.4-5.2-15.2C162,40.6,160.3,40.2,158.6,40.2"
      />
      <path
        d="M205,121.1c-1.2,0-2.4,0.1-3.6,0.1L233,56.5c2.7-5.6,0.4-12.4-5.2-15.2
				c-1.6-0.8-3.3-1.2-5-1.2h-12.2c-4.3,0-8.3,2.5-10.2,6.4l-76.6,157c-2.7,5.6-0.4,12.4,5.2,15.2c1.6,0.8,3.3,1.2,5,1.2h12.2
				c4.3,0,8.3-2.5,10.2-6.4L165,196c14.8,22.1,44.7,28.1,66.8,13.3s28.1-44.7,13.3-66.8C236.2,129.1,221.1,121.1,205,121.1
				 M205.3,207.3c-21,0-38.1-17-38.1-38.1c0-21,17-38.1,38.1-38.1c21,0,38.1,17,38.1,38.1c0,0,0,0,0,0
				C243.4,190.3,226.3,207.3,205.3,207.3"
      />
      <path d="M211.3,151.3h-11.9v11.9h-11.9v11.9h11.9v11.9h11.9v-11.9h11.9v-11.9h-11.9V151.3z" />
    </g>
  </svg>
);

export default NewPathIcon;
