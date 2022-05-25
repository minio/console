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

const FileLockIcon = (props: SVGProps<SVGSVGElement>) => (
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
        data-name="Trazado 467"
        d="M235.995 77.198c.388-15.753.958-32.241-.5-47.941-1.094-11.756-6.192-21.735-17.831-25.916a42.81 42.81 0 0 0-5.016-1.447c-6.551-1.479-13.433-1.6-20.09-1.8-11.727-.343-23.449.364-35.176.313-23.494-.1-46.986.324-70.48.415q-4.226.015-8.455.017H36.241a17.26 17.26 0 0 0-17.24 17.241v220.678a17.26 17.26 0 0 0 17.24 17.241h182.541a17.26 17.26 0 0 0 17.241-17.241V128.816c-.001-17.183-.447-34.459-.028-51.618Zm-20.921 145.989a14.888 14.888 0 0 1-14.887 14.887H51.817a14.888 14.888 0 0 1-14.888-14.887V33.662a14.888 14.888 0 0 1 14.888-14.888h99.548v25.458a37.8 37.8 0 0 0 37.757 37.76h25.952Zm0-157.657h-25.952a21.321 21.321 0 0 1-21.3-21.3V18.772h32.358a14.889 14.889 0 0 1 14.888 14.887Z"
      />
      <path
        data-name="Trazado 468"
        d="M167.462 106.737h-11.678V94.561a28.113 28.113 0 0 0-28.066-27.984h-.044a28.117 28.117 0 0 0-28.069 27.99v12.17H87.924a23.834 23.834 0 0 0-23.776 23.767v45.491a23.675 23.675 0 0 0 22.986 23.75l40.558 7.889 40.559-7.889a23.675 23.675 0 0 0 22.986-23.753V130.5a23.832 23.832 0 0 0-23.776-23.764Zm-52.872-12.17a13.109 13.109 0 0 1 13.091-13.042h.023a13.106 13.106 0 0 1 13.087 13.042v12.17h-26.2Zm61.656 81.424a8.831 8.831 0 0 1-8.788 8.821h-.725l-39.043 7.592-38.843-7.553-.4-.039h-.515a8.833 8.833 0 0 1-8.794-8.822V130.5a8.831 8.831 0 0 1 8.789-8.82h79.529a8.831 8.831 0 0 1 8.794 8.821Z"
      />
      <path
        data-name="Trazado 469"
        d="M127.556 141.528a12.366 12.366 0 0 0-12.353 12.351 12.322 12.322 0 0 0 4.507 9.544v7.2a7.547 7.547 0 0 0 7.517 7.512h.659a7.547 7.547 0 0 0 7.511-7.517v-7.191a12.324 12.324 0 0 0 4.507-9.542 12.367 12.367 0 0 0-12.349-12.357Z"
      />
      <path data-name="Rect\xE1ngulo 904" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default FileLockIcon;
