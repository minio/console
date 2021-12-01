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

const ConsoleIcon = (props: SVGProps<SVGSVGElement>) => (
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
        data-name="Uni\xF3n 20"
        d="M17.4 256.099A17.314 17.314 0 0 1 .1 238.808V17.402A17.322 17.322 0 0 1 17.4.102h221.4a17.325 17.325 0 0 1 17.3 17.3v221.406a17.316 17.316 0 0 1-17.3 17.291Zm.7-32.922a14.938 14.938 0 0 0 14.934 14.937h190.138a14.935 14.935 0 0 0 14.93-14.937v-133.4h-220Zm45.949-69.443a6.943 6.943 0 0 1-6.814-7.061v-16.314a6.937 6.937 0 0 1 6.814-7.054h62.056a6.924 6.924 0 0 1 6.795 7.054v16.318a6.929 6.929 0 0 1-6.795 7.061Z"
      />
      <path
        data-name="Trazado 343 - Contorno"
        d="M17.402 0h221.4a17.421 17.421 0 0 1 17.4 17.4v221.409a17.416 17.416 0 0 1-17.4 17.391h-221.4a17.416 17.416 0 0 1-17.4-17.391V17.401A17.421 17.421 0 0 1 17.402 0Zm221.4 256a17.216 17.216 0 0 0 17.2-17.191V17.401a17.221 17.221 0 0 0-17.2-17.2h-221.4a17.221 17.221 0 0 0-17.2 17.2v221.408A17.216 17.216 0 0 0 17.402 256ZM18.002 89.676h220.2v133.5a14.945 14.945 0 0 1-4.4 10.634 14.93 14.93 0 0 1-10.627 4.405H33.033a14.93 14.93 0 0 1-10.627-4.405 14.942 14.942 0 0 1-4.4-10.634Zm220 .2h-219.8v133.3a14.745 14.745 0 0 0 4.346 10.493 14.73 14.73 0 0 0 10.486 4.347h190.139a14.73 14.73 0 0 0 10.486-4.347 14.745 14.745 0 0 0 4.346-10.493Z"
      />
      <path
        data-name="Trazado 344 - Contorno"
        d="M64.05 123.202h62.057a6.726 6.726 0 0 1 4.878 2.1A7.247 7.247 0 0 1 133 130.36v16.318a7.038 7.038 0 0 1-6.893 7.16H64.05a7.049 7.049 0 0 1-6.915-7.16V130.36a7.045 7.045 0 0 1 6.915-7.158Zm62.057 30.431a6.838 6.838 0 0 0 6.693-6.96v-16.318a7.047 7.047 0 0 0-1.959-4.919 6.526 6.526 0 0 0-4.733-2.034H64.051a6.845 6.845 0 0 0-6.714 6.953v16.318a6.848 6.848 0 0 0 6.714 6.96Z"
      />
      <path
        data-name="Rect\xE1ngulo 889"
        fill="none"
        d="M.102.1h256v256h-256z"
      />
    </g>
  </svg>
);

export default ConsoleIcon;
