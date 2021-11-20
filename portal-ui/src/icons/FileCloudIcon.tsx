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

const FileCloudIcon = (props: SVGProps<SVGSVGElement>) => (
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
        data-name="Trazado 456"
        d="M235.996 77.198c.388-15.754.958-32.242-.5-47.942-1.093-11.755-6.192-21.735-17.831-25.915a42.548 42.548 0 0 0-5.016-1.447c-6.55-1.479-13.433-1.6-20.09-1.8-11.727-.343-23.45.365-35.176.314-23.494-.1-46.986.322-70.479.414q-4.228.016-8.456.017H36.242a17.26 17.26 0 0 0-17.241 17.24v220.679a17.26 17.26 0 0 0 17.241 17.24h182.54a17.26 17.26 0 0 0 17.241-17.24V128.816c-.002-17.184-.45-34.46-.027-51.618Zm-20.923 145.983a14.889 14.889 0 0 1-14.889 14.889H51.815a14.889 14.889 0 0 1-14.888-14.888V33.662a14.887 14.887 0 0 1 14.889-14.888h99.548v25.458a37.8 37.8 0 0 0 37.756 37.76h25.952Zm0-157.656h-25.952a21.32 21.32 0 0 1-21.3-21.3V18.767h32.358a14.888 14.888 0 0 1 14.889 14.889Z"
      />
      <path
        data-name="Trazado 457"
        d="M139.565 84.765a46.768 46.768 0 0 0-42.22 26.113 42.762 42.762 0 0 0-5.095-.3 42.914 42.914 0 0 0-42.866 42.867 42.916 42.916 0 0 0 42.866 42.866h73.123a38.608 38.608 0 0 0 38.566-38.565 38.754 38.754 0 0 0-17.656-32.377 46.973 46.973 0 0 0-46.718-40.6Zm25.809 94.632H92.251a25.986 25.986 0 0 1-25.957-25.957 25.987 25.987 0 0 1 25.957-25.957 25.525 25.525 0 0 1 7.753 1.2 8.459 8.459 0 0 0 6.505-.577 8.446 8.446 0 0 0 4.154-5.039 29.968 29.968 0 0 1 28.9-21.39 30.142 30.142 0 0 1 30.24 29.173 8.453 8.453 0 0 0 4.83 7.341 21.744 21.744 0 0 1 12.4 19.553 21.68 21.68 0 0 1-21.654 21.652Z"
      />
      <path data-name="Rect\xE1ngulo 898" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default FileCloudIcon;
