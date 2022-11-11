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

const EditYamlIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={"min-icon"}
    viewBox="0 0 256 256"
    fill={"currentcolor"}
    {...props}
  >
    <defs>
      <clipPath id="clip-path">
        <rect
          id="Rectángulo_1012"
          data-name="Rectángulo 1012"
          width="219.579"
          height="256"
        />
      </clipPath>
      <clipPath id="clip-Edit_YAML">
        <rect width="256" height="256" />
      </clipPath>
    </defs>
    <g id="Edit_YAML" data-name="Edit YAML" clipPath="url(#clip-Edit_YAML)">
      <rect width="256" height="256" fill="#fff" />
      <g id="Edit_YAML_Icon" data-name="Edit YAML Icon">
        <rect
          id="Rectángulo_1013"
          data-name="Rectángulo 1013"
          width="256"
          height="256"
          fill="none"
        />
        <g id="Grupo_2399" data-name="Grupo 2399" transform="translate(25)">
          <g id="Grupo_2398" data-name="Grupo 2398">
            <path
              id="Trazado_7135"
              data-name="Trazado 7135"
              d="M393.716,60.148a7.412,7.412,0,0,0-5.1,2.082L369.7,81.158a1.738,1.738,0,0,0-.5.946l-1.953,9.528a1.754,1.754,0,0,0,.5,1.64,1.912,1.912,0,0,0,1.323.5.8.8,0,0,0,.378-.063l9.453-1.83a1.736,1.736,0,0,0,.946-.5l18.906-18.928a7.242,7.242,0,0,0,0-10.158,6.957,6.957,0,0,0-5.042-2.145"
              transform="translate(-207.088 -33.921)"
            />
            <path
              id="Trazado_7136"
              data-name="Trazado 7136"
              d="M176.1,0a43.4,43.4,0,0,0-34.3,16.755c-4.119.092-8.241.181-12.357.164-21.964-.1-43.951.3-65.928.385-2.625.014-5.267.014-7.914.014H16.136A16.146,16.146,0,0,0,0,33.445V239.878A16.142,16.142,0,0,0,16.136,256H186.882A16.131,16.131,0,0,0,203,239.877V137.027c0-16.076-.4-32.234-.013-48.284.089-3.731.185-7.51.262-11.308A43.478,43.478,0,0,0,176.1,0M51.689,162.377v19.369H37.8V162.56l-19.3-31.977H34.44l10.343,19.333,10.306-19.333H70.547Zm81.6,19.369H119.4V149.733L111.182,177h-14.8l-8.223-27.262v32.014H74.271V130.583H93.53L103.8,161.354l10.233-30.771h19.259Zm45.823,0H140.6V130.583h13.888v38.372h24.631ZM176.359,77.831a34.352,34.352,0,1,1,34.352-34.352,34.352,34.352,0,0,1-34.352,34.352"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default EditYamlIcon;
