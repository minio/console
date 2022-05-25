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

const FileWorldIcon = (props: SVGProps<SVGSVGElement>) => (
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
        data-name="Trazado 465"
        d="M235.997 77.196c.388-15.754.958-32.242-.5-47.941-1.094-11.755-6.193-21.736-17.831-25.915a42.42 42.42 0 0 0-5.017-1.447C206.1.414 199.217.293 192.56.093c-11.727-.343-23.45.366-35.177.314-23.493-.1-46.985.322-70.479.414q-4.228.018-8.455.017H36.242a17.26 17.26 0 0 0-17.241 17.241v220.686a17.259 17.259 0 0 0 17.241 17.24h182.541a17.26 17.26 0 0 0 17.24-17.24V128.813c.003-17.182-.448-34.458-.026-51.617Zm-20.922 145.986a14.889 14.889 0 0 1-14.89 14.89H51.818a14.888 14.888 0 0 1-14.888-14.89V33.665a14.888 14.888 0 0 1 14.889-14.889h99.547v25.459a37.8 37.8 0 0 0 37.757 37.758h25.951Zm0-157.655h-25.949a21.321 21.321 0 0 1-21.3-21.3V18.765h32.359a14.888 14.888 0 0 1 14.888 14.889Z"
      />
      <path
        data-name="Trazado 466"
        d="M125.412 80.164a71.163 71.163 0 0 0-71.086 71.082 71.163 71.163 0 0 0 71.082 71.082 71.163 71.163 0 0 0 71.083-71.082 71.163 71.163 0 0 0-71.079-71.082Zm-23.487 19.951c-8.025 12.368-14.515 27.117-16.227 43.732h-16.07a56.413 56.413 0 0 1 32.3-43.732Zm-32.3 58.529h15.866a88.49 88.49 0 0 0 4.224 21.1 102.125 102.125 0 0 0 10.114 21.612 56.4 56.4 0 0 1-30.2-42.712Zm48.386 43.154c-6.658-8.526-16.02-23.7-17.687-43.154h17.687Zm0-57.951h-17.4c1.562-12.561 6.66-26.4 17.4-41.033Zm14.8-41.032c10.734 14.633 15.833 28.471 17.4 41.032h-17.4Zm0 98.982v-43.154h17.687c-1.672 19.455-11.029 34.63-17.688 43.155Zm18.183-.441a102 102 0 0 0 10.112-21.612 88.429 88.429 0 0 0 4.224-21.1h15.867a56.4 56.4 0 0 1-30.2 42.713Zm14.133-57.51c-1.711-16.616-8.2-31.364-16.226-43.732a56.413 56.413 0 0 1 32.3 43.731Z"
      />
      <path data-name="Rect\xE1ngulo 910" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default FileWorldIcon;
