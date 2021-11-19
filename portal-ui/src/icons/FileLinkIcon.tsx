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

const FileLinkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.281 0 256 256"
    >
      <g data-name="Grupo 1551">
        <path
          data-name="Trazado 458"
          d="M216.997 77.194c.386-15.754.957-32.242-.5-47.941-1.093-11.755-6.192-21.736-17.832-25.915a42.414 42.414 0 00-5.016-1.447C187.1.412 180.217.291 173.56.091c-11.728-.343-23.449.366-35.176.314-23.494-.1-46.986.322-70.479.414q-4.227.018-8.456.017H17.243a17.26 17.26 0 00-17.24 17.24v220.687a17.26 17.26 0 0017.24 17.24h182.541a17.26 17.26 0 0017.24-17.24V128.811c-.003-17.182-.449-34.458-.027-51.617zM196.076 223.18a14.888 14.888 0 01-14.889 14.89H32.819a14.889 14.889 0 01-14.889-14.89V33.663a14.889 14.889 0 0114.889-14.889h99.548v25.459a37.8 37.8 0 0037.756 37.758h25.953zm0-157.655h-25.953a21.32 21.32 0 01-21.294-21.3V18.766h32.358a14.888 14.888 0 0114.889 14.889z"
        />
        <path
          data-name="Trazado 459"
          d="M112.061 178.382l-22.8 22.8a17.951 17.951 0 01-25.357 0 17.815 17.815 0 01-5.251-12.679 17.813 17.813 0 015.254-12.678l22.8-22.8a17.972 17.972 0 0125.33-.015 7.521 7.521 0 0010.621.186 7.46 7.46 0 002.292-5.271 7.46 7.46 0 00-2.1-5.344 5.95 5.95 0 00-.178-.178 33.044 33.044 0 00-46.59 0l-22.794 22.814a32.7 32.7 0 00-9.659 23.266 32.7 32.7 0 009.623 23.281 33.135 33.135 0 0023.292 9.659h.166a32.936 32.936 0 0023.174-9.615l22.808-22.811a7.459 7.459 0 002.107-5.349 7.467 7.467 0 00-2.292-5.271 7.485 7.485 0 00-10.446.005z"
        />
        <path
          data-name="Trazado 460"
          d="M110.04 96.474l-22.809 22.809a7.462 7.462 0 00-2.106 5.348 7.458 7.458 0 002.291 5.272 7.482 7.482 0 0010.437 0l22.822-22.822a17.8 17.8 0 0112.575-5.484 17.879 17.879 0 0112.77 5.015 17.8 17.8 0 015.483 12.576 17.811 17.811 0 01-5.015 12.771c-.152.157-.308.313-.479.479l-22.8 22.8a18.058 18.058 0 01-25.357-.009 7.521 7.521 0 00-10.622.185 7.489 7.489 0 00.016 10.451 32.92 32.92 0 0023.292 9.583 32.935 32.935 0 0023.3-9.585l22.8-22.807a32.731 32.731 0 009.337-23.423 32.737 32.737 0 00-9.962-23.166 32.773 32.773 0 00-45.973.007z"
        />
      </g>
    </svg>
  );
};

export default FileLinkIcon;
