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

const LambdaBalloonIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <path d="m127.996 255.998-48-64H42.252a31.385 31.385 0 0 1-14.189-3.563 54.7 54.7 0 0 1-14.061-10.69 55.543 55.543 0 0 1-10.5-14.313 32.835 32.835 0 0 1-3.5-14.434v-106a32.839 32.839 0 0 1 3.5-14.438 55.538 55.538 0 0 1 10.5-14.312A54.623 54.623 0 0 1 28.063 3.561 31.4 31.4 0 0 1 42.252 0h171.494a31.389 31.389 0 0 1 14.188 3.561 54.7 54.7 0 0 1 14.068 10.687 55.531 55.531 0 0 1 10.5 14.313 32.839 32.839 0 0 1 3.5 14.437v106a32.835 32.835 0 0 1-3.5 14.438 55.532 55.532 0 0 1-10.5 14.313 54.676 54.676 0 0 1-14.064 10.69 31.371 31.371 0 0 1-14.187 3.563h-37.758l-47.994 64Zm2.3-164.808c3.25 6.531 8.105 16.287 12.771 25.671l2.207 4.436c4.8 9.657 8.277 16.634 8.4 16.856a28.061 28.061 0 0 0 11.422 12.328 33.352 33.352 0 0 0 16.873 4.511 34.058 34.058 0 0 0 9.076-1.229 7.893 7.893 0 0 0 4.939-3.831 6.445 6.445 0 0 0 .395-5.167 7.229 7.229 0 0 0-2.971-3.688 8.874 8.874 0 0 0-4.754-1.376 9.005 9.005 0 0 0-2.395.324 16.147 16.147 0 0 1-4.268.574 15.731 15.731 0 0 1-8.162-2.244 13.156 13.156 0 0 1-5.385-6.093l-.385-.771-2.3-4.636-.037-.073c-8.051-16.214-29.434-59.283-32.84-65.75l-.711-1.376-.127-.241v-.007c-2.111-3.99-5.3-10.021-10.895-15.062a34.192 34.192 0 0 0-10.361-6.44 40.584 40.584 0 0 0-14.949-2.656c-4.457 0-8.082 3.223-8.082 7.185s3.625 7.19 8.082 7.19h.014c12.277 0 16.834 6.963 21.516 16.065l.779 1.469c.379.724 1 1.938 1.85 3.617l.105.211 1.953 3.842-44.129 69.447a6.471 6.471 0 0 0-.658 5.161 7.3 7.3 0 0 0 3.842 4.43 8.881 8.881 0 0 0 3.973.933 8.922 8.922 0 0 0 3.906-.893 7.746 7.746 0 0 0 3-2.558l38.313-60.161Z" />
    </g>
  </svg>
);

export default LambdaBalloonIcon;
