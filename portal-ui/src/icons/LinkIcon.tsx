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

const LinkIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <path d="M230.01,21.29c-27.36-27.35-71.33-28.49-100.07-2.6h0l-36.83,36.7c-6.45,6.46-11.62,14.09-15.24,22.48-7.22,3.1-13.89,7.37-19.73,12.62h0L21.29,127.17c-28.39,28.39-28.39,74.42,0,102.81,28.39,28.39,74.42,28.39,102.81,0l36.77-36.77h0c5.25-5.85,9.52-12.51,12.62-19.73,8.39-3.62,16.01-8.79,22.48-15.24l36.77-36.77h0c25.9-28.73,24.76-72.72-2.6-100.07l-.12-.12ZM99.3,203.86h0c-14.33,14.33-37.55,14.33-51.88,0-14.33-14.33-14.33-37.55,0-51.88h0l26.81-26.81c6.56,25.45,26.43,45.32,51.88,51.88l-26.81,26.81Zm19.92-71.8c-6.28-6.28-10.05-14.63-10.62-23.49,18.38,1.16,33.02,15.81,34.17,34.19-8.86-.57-17.21-4.34-23.49-10.62l-.06-.08Zm86.94-35.05l-2.25,2.25h0l-26.81,26.81c-6.56-25.45-26.43-45.32-51.88-51.88l26.81-26.81h0l2.25-2.25h0c15.54-13,38.67-10.94,51.68,4.59,11.4,13.62,11.4,33.46,0,47.08v.1l.21,.1Z" />
  </svg>
);

export default LinkIcon;
