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

const EditTagIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={"min-icon"}
    viewBox="0 0 256 256"
    {...props}
  >
    <g transform="translate(0 0)">
      <g transform="translate(0 0)">
        <path
          d="M224.54,131.96c26.08-14.98,35.99-47.67,22.62-74.61-11.77-25.71-42.15-37.02-67.87-25.25-.96,.44-1.9,.91-2.83,1.4-9.84,5.4-17.74,13.74-22.62,23.85L108.09,9.09C102.84,3.49,95.57,.22,87.9,0H29.63C12.83,.49-.41,14.46,0,31.25v61.73c.19,7.83,3.25,15.33,8.6,21.05l123.12,129.87c10.78,11.6,28.92,12.27,40.52,1.49,.52-.48,1.01-.98,1.49-1.49l57.48-60.63c11.52-12.53,11.52-31.8,0-44.32l-6.68-6.98ZM60.25,79.27c-8.45-.23-15.12-7.27-14.89-15.72-.23-8.45,6.44-15.49,14.89-15.72,8.45,.24,15.11,7.27,14.89,15.72,.22,8.45-6.44,15.48-14.89,15.72m99.09,3.47h0c-.61-23.53,17.95-43.11,41.47-43.75,23.53,.64,42.09,20.22,41.47,43.75,.61,23.53-17.95,43.11-41.47,43.75-23.53-.64-42.09-20.22-41.47-43.75"
          fill="#4ccb92"
        />
        <path
          d="M217.93,64.76c-1.49-1.66-3.62-2.61-5.85-2.61-2.24,.02-4.37,.94-5.92,2.55l-21.93,23.19c-.31,.32-.52,.72-.59,1.16l-2.28,11.67c-.15,.73,.07,1.48,.59,2.01,.41,.4,.96,.62,1.53,.61,.14,.04,.29,.04,.44,0l10.98-2.24c.42-.08,.81-.3,1.1-.62l21.93-23.19c3.22-3.52,3.22-8.92,0-12.45v-.07Z"
          fill="#4ccb92"
        />
      </g>
    </g>
  </svg>
);

export default EditTagIcon;
