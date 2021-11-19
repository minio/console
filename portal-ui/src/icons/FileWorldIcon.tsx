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

const FileWorldIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.281 0 256 256"
    >
      <path
        data-name="Trazado 465"
        d="M216.997 77.194c.388-15.754.958-32.242-.5-47.941-1.094-11.755-6.193-21.736-17.831-25.915a42.4 42.4 0 00-5.017-1.447C187.1.412 180.217.291 173.56.091c-11.727-.343-23.45.366-35.177.314-23.493-.1-46.985.322-70.479.414q-4.228.018-8.455.017H17.242A17.26 17.26 0 00.001 18.076v220.687a17.26 17.26 0 0017.241 17.24h182.541a17.26 17.26 0 0017.24-17.24V128.811c.003-17.182-.448-34.458-.026-51.617zM196.075 223.18a14.888 14.888 0 01-14.888 14.89H32.818a14.888 14.888 0 01-14.888-14.89V33.663a14.888 14.888 0 0114.888-14.889h99.548v25.459a37.8 37.8 0 0037.757 37.758h25.951zm0-157.655h-25.949a21.321 21.321 0 01-21.3-21.3V18.766h32.359a14.888 14.888 0 0114.888 14.889z"
      />
      <path
        data-name="Trazado 466"
        d="M106.412 80.162a71.163 71.163 0 00-71.086 71.082 71.163 71.163 0 0071.082 71.082 71.163 71.163 0 0071.083-71.082 71.163 71.163 0 00-71.079-71.082zm-23.487 19.951C74.9 112.481 68.41 127.23 66.698 143.845h-16.07a56.413 56.413 0 0132.298-43.732zm-32.3 58.529h15.866a88.5 88.5 0 004.224 21.1 102.1 102.1 0 0010.113 21.613 56.4 56.4 0 01-30.202-42.713zm48.386 43.154c-6.658-8.526-16.02-23.7-17.687-43.154h17.687zm0-57.951h-17.4c1.562-12.561 6.66-26.4 17.4-41.033zm14.8-41.032c10.734 14.633 15.833 28.471 17.4 41.032h-17.4zm0 98.982v-43.154h17.687c-1.672 19.454-11.029 34.63-17.688 43.155zm18.183-.441a102 102 0 0010.112-21.612 88.437 88.437 0 004.224-21.1h15.867a56.4 56.4 0 01-30.204 42.713zm14.133-57.51c-1.711-16.616-8.2-31.364-16.226-43.732a56.414 56.414 0 0132.3 43.732z"
      />
    </svg>
  );
};

export default FileWorldIcon;
