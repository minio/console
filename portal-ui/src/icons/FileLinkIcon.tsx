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

const FileLinkIcon = (props: SVGProps<SVGSVGElement>) => (
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
      <g data-name="Grupo 1551">
        <path
          data-name="Trazado 458"
          d="M235.995 76.194c.386-15.753.957-32.241-.5-47.94-1.093-11.754-6.192-21.735-17.832-25.914a42.4 42.4 0 0 0-5.016-1.447c-6.549-1.479-13.432-1.6-20.089-1.8-11.728-.343-23.449.366-35.176.314-23.494-.1-46.986.322-70.479.414q-4.227.018-8.456.017H36.241A17.26 17.26 0 0 0 19 17.078v220.681a17.259 17.259 0 0 0 17.24 17.24h182.541a17.259 17.259 0 0 0 17.24-17.24V127.81c-.002-17.182-.448-34.457-.026-51.616Zm-20.921 145.982a14.889 14.889 0 0 1-14.891 14.89H51.817a14.89 14.89 0 0 1-14.889-14.89V32.665a14.889 14.889 0 0 1 14.889-14.889h99.548v25.458a37.8 37.8 0 0 0 37.756 37.757h25.953Zm0-157.651h-25.953a21.319 21.319 0 0 1-21.294-21.3v-25.46h32.358a14.888 14.888 0 0 1 14.889 14.89Z"
        />
        <path
          data-name="Trazado 459"
          d="m131.059 177.378-22.8 22.8a17.95 17.95 0 0 1-25.356 0 17.815 17.815 0 0 1-5.251-12.68 17.814 17.814 0 0 1 5.254-12.678l22.8-22.8a17.972 17.972 0 0 1 25.331-.015 7.521 7.521 0 0 0 10.621.187 7.458 7.458 0 0 0 2.292-5.271 7.458 7.458 0 0 0-2.1-5.344 7.641 7.641 0 0 0-.178-.179 33.044 33.044 0 0 0-46.59 0l-22.793 22.814a32.7 32.7 0 0 0-9.659 23.266 32.7 32.7 0 0 0 9.623 23.281 33.136 33.136 0 0 0 23.292 9.659h.166a32.935 32.935 0 0 0 23.174-9.616l22.808-22.811a7.462 7.462 0 0 0 2.107-5.349 7.467 7.467 0 0 0-2.292-5.271 7.485 7.485 0 0 0-10.446.006Z"
        />
        <path
          data-name="Trazado 460"
          d="m129.038 95.473-22.809 22.809a7.461 7.461 0 0 0-2.105 5.348 7.46 7.46 0 0 0 2.291 5.271 7.482 7.482 0 0 0 10.437 0l22.821-22.822a17.8 17.8 0 0 1 12.576-5.484 17.878 17.878 0 0 1 12.769 5.015 17.8 17.8 0 0 1 5.483 12.576 17.811 17.811 0 0 1-5.016 12.771 18.02 18.02 0 0 1-.479.479l-22.8 22.8a18.058 18.058 0 0 1-25.357-.009 7.522 7.522 0 0 0-10.623.186 7.489 7.489 0 0 0 .017 10.451 32.921 32.921 0 0 0 23.292 9.583 32.932 32.932 0 0 0 23.3-9.584l22.8-22.808a32.728 32.728 0 0 0 9.337-23.423 32.737 32.737 0 0 0-9.962-23.166 32.772 32.772 0 0 0-45.973 0Z"
        />
      </g>
      <path data-name="Rect\xE1ngulo 913" fill="none" d="M0-1h256v256H0z" />
    </g>
  </svg>
);

export default FileLinkIcon;
