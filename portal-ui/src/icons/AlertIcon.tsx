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

const AlertIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`min-icon`}
    fill={"currentcolor"}
    viewBox="0 0 256 256"
    {...props}
  >
    <path d="M125.28,0C56.09,0,0,56.09,0,125.28s56.09,125.28,125.28,125.28,125.28-56.09,125.28-125.28S194.47,0,125.28,0Zm-17.54,35.55h31.6V105.62c0,7.43-.39,14.78-1.16,22.05-.78,7.27-1.86,14.82-3.25,22.66h-22.78c-1.39-7.84-2.47-15.39-3.25-22.66-.78-7.27-1.16-14.62-1.16-22.05V35.55Zm33.81,167.7c-1.06,2.37-2.49,4.43-4.29,6.19-1.8,1.76-3.9,3.12-6.31,4.1-2.41,.98-5,1.47-7.78,1.47s-5.49-.49-7.9-1.47c-2.41-.98-4.51-2.35-6.31-4.1-1.8-1.76-3.21-3.82-4.23-6.19-1.02-2.37-1.53-4.94-1.53-7.72s.51-5.25,1.53-7.66c1.02-2.41,2.43-4.49,4.23-6.25,1.8-1.76,3.9-3.14,6.31-4.17,2.41-1.02,5.04-1.53,7.9-1.53s5.37,.51,7.78,1.53c2.41,1.02,4.51,2.41,6.31,4.17,1.79,1.76,3.22,3.84,4.29,6.25,1.06,2.41,1.59,4.96,1.59,7.66s-.53,5.35-1.59,7.72Z" />
  </svg>
);

export default AlertIcon;
