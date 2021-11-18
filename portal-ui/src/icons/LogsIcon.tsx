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

const LogsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 0h256v256H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)">
        <path
          data-name="Trazado 343"
          d="M238.7 0H17.3A17.324 17.324 0 000 17.3v221.4a17.316 17.316 0 0017.3 17.291h221.4A17.316 17.316 0 00256 238.7V17.3A17.324 17.324 0 00238.7 0zm-15.631 238H32.931a14.938 14.938 0 01-14.932-14.938V89.673h220v133.394a14.938 14.938 0 01-14.93 14.938z"
        />
        <path
          data-name="Trazado 343 - Contorno"
          d="M17.3-.1h221.4a17.42 17.42 0 0117.4 17.4v221.4a17.415 17.415 0 01-17.4 17.391H17.3A17.415 17.415 0 01-.1 238.7V17.3A17.42 17.42 0 0117.3-.1zm221.4 255.989a17.215 17.215 0 0017.2-17.19v-221.4a17.22 17.22 0 00-17.2-17.2H17.3a17.22 17.22 0 00-17.2 17.2v221.4a17.215 17.215 0 0017.2 17.19zM17.9 89.573h220.2v133.494a14.944 14.944 0 01-4.4 10.633 14.93 14.93 0 01-10.627 4.4H32.931a14.93 14.93 0 01-10.627-4.4 14.942 14.942 0 01-4.4-10.633zm220 .2H18.1v133.294a14.744 14.744 0 004.346 10.492 14.73 14.73 0 0010.486 4.346h190.139a14.73 14.73 0 0010.486-4.346 14.744 14.744 0 004.346-10.492z"
        />
        <path
          data-name="Trazado 344"
          d="M126.005 123.197H63.948a6.935 6.935 0 00-6.814 7.053v16.317a6.941 6.941 0 006.814 7.06h62.057a6.927 6.927 0 006.793-7.06V130.25a6.921 6.921 0 00-6.793-7.053z"
        />
        <path
          data-name="Trazado 344 - Contorno"
          d="M63.948 123.097h62.057a6.726 6.726 0 014.878 2.1 7.247 7.247 0 012.015 5.057v16.317a7.038 7.038 0 01-6.893 7.16H63.948a7.048 7.048 0 01-6.915-7.16v-16.317a7.045 7.045 0 016.915-7.157zm62.057 30.429a6.838 6.838 0 006.693-6.96v-16.317a7.046 7.046 0 00-1.959-4.919 6.526 6.526 0 00-4.733-2.034H63.949a6.845 6.845 0 00-6.714 6.953v16.317a6.848 6.848 0 006.714 6.96z"
        />
      </g>
    </svg>
  );
};

export default LogsIcon;
