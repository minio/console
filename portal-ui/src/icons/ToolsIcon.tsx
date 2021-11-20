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

const ToolsIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <g data-name="ToolsIcon">
        <path
          data-name="Rect\xE1ngulo 846"
          fill="none"
          d="M0 0h255.535v255.516H0z"
        />
        <g data-name="Grupo 1552">
          <path
            data-name="Uni\xF3n 12"
            d="M187.377 246.393 68.398 127.416q-2.3.164-4.6.164a63.373 63.373 0 0 1-45.111-18.629A64.284 64.284 0 0 1 2.218 47.216a19.958 19.958 0 0 1 33.414-9.02l12.7 12.695 3.006-3-12.7-12.7a19.962 19.962 0 0 1 9.02-33.412A65.038 65.038 0 0 1 64.283-.384a63.344 63.344 0 0 1 45.113 18.635 64.122 64.122 0 0 1 18.461 49.688l.59.59c.146-.153.291-.3.441-.453l23.5-23.312-.055-3.286a19.965 19.965 0 0 1 10.5-17.912l40.215-21.659a19.949 19.949 0 0 1 23.523 3.4l23.526 23.33a19.973 19.973 0 0 1 3.266 24.089l-22.524 39.362a19.955 19.955 0 0 1-17.4 10.049l-2.51-.009-24.086 23.888c-.15.151-.3.3-.461.443l60.469 60.463a31.038 31.038 0 0 1 0 43.848l-15.619 15.622a31.015 31.015 0 0 1-43.855 0Zm14.119-14.117a11.039 11.039 0 0 0 15.617 0l15.619-15.617a11.033 11.033 0 0 0 0-15.617L106.566 74.884a43.813 43.813 0 0 0-53.811-53.81L79.57 47.886l-31.239 31.23-26.812-26.8a43.815 43.815 0 0 0 53.809 53.8Zm-29.2-191.135.2 11.8-29.549 29.307 29.838 29.6 29.951-29.712 10.777.041 22.524-39.368-23.52-23.331Z"
          />
          <g data-name="Grupo 1551">
            <path
              data-name="Trazado 444"
              d="m80.891 143.919-57.656 57.656a10.859 10.859 0 0 0 0 15.357l15.357 15.359a10.861 10.861 0 0 0 15.359 0l57.652-57.655-30.712-30.717m0-20a20 20 0 0 1 14.142 5.858l30.716 30.717a20 20 0 0 1 0 28.284l-57.656 57.656a30.661 30.661 0 0 1-21.822 9.039 30.658 30.658 0 0 1-21.821-9.039l-15.358-15.36a30.657 30.657 0 0 1-9.038-21.82 30.656 30.656 0 0 1 9.04-21.822l57.654-57.655a20 20 0 0 1 14.143-5.858Z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default ToolsIcon;
