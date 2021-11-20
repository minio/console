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

const FileVideoIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <path
        data-name="Trazado 424"
        d="M235.995 77.199c.387-15.754.958-32.242-.5-47.942-1.092-11.755-6.192-21.735-17.832-25.915a42.444 42.444 0 0 0-5.016-1.447c-6.549-1.479-13.432-1.6-20.09-1.8-11.726-.344-23.449.364-35.176.314-23.494-.1-46.985.322-70.479.414q-4.229.016-8.456.017H36.24A17.26 17.26 0 0 0 19 18.08v220.68A17.26 17.26 0 0 0 36.24 256h182.538a17.26 17.26 0 0 0 17.241-17.24V128.818c0-17.184-.441-34.459-.024-51.619Zm-20.922 145.987a14.889 14.889 0 0 1-14.886 14.887H51.816a14.89 14.89 0 0 1-14.889-14.888V33.664a14.888 14.888 0 0 1 14.888-14.888h99.547v25.458a37.8 37.8 0 0 0 37.757 37.76h25.952Zm0-157.657h-25.952a21.32 21.32 0 0 1-21.295-21.3V18.771h32.359a14.888 14.888 0 0 1 14.888 14.888Z"
      />
      <path
        data-name="Trazado 425"
        d="m171.914 125.006-61.323-35.407a17.725 17.725 0 0 0-17.9 0 17.717 17.717 0 0 0-8.953 15.5v70.811a17.718 17.718 0 0 0 8.951 15.5 17.865 17.865 0 0 0 8.952 2.427 17.872 17.872 0 0 0 8.952-2.427l61.323-35.4a17.723 17.723 0 0 0 8.952-15.5 17.72 17.72 0 0 0-8.954-15.504Zm-8.455 16.362-61.323 35.4a.914.914 0 0 1-.992 0 .911.911 0 0 1-.5-.86v-70.811a.909.909 0 0 1 .5-.858 1 1 0 0 1 .5-.147.959.959 0 0 1 .489.146l61.323 35.407a.909.909 0 0 1 .5.858.91.91 0 0 1-.5.865Z"
      />
      <path data-name="Rect\xE1ngulo 909" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default FileVideoIcon;
