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

const FileXlsIcon = (props: SVGProps<SVGSVGElement>) => (
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
        data-name="Trazado 461"
        d="M235.995 77.198c.386-15.753.957-32.242-.5-47.942-1.094-11.755-6.193-21.735-17.832-25.914a42.537 42.537 0 0 0-5.017-1.448c-6.549-1.479-13.432-1.6-20.09-1.8-11.726-.343-23.448.366-35.176.314-23.494-.1-46.985.324-70.479.415Q82.673.84 78.445.84H36.239a17.26 17.26 0 0 0-17.24 17.243v220.678a17.26 17.26 0 0 0 17.24 17.24h182.539a17.258 17.258 0 0 0 17.24-17.24V128.815c.002-17.183-.44-34.458-.023-51.617Zm-20.922 145.988a14.888 14.888 0 0 1-14.888 14.888H51.817a14.888 14.888 0 0 1-14.888-14.888V33.661a14.889 14.889 0 0 1 14.889-14.889h99.546v25.459a37.8 37.8 0 0 0 37.757 37.758h25.952Zm0-157.657h-25.952a21.32 21.32 0 0 1-21.294-21.3V18.771h32.359a14.889 14.889 0 0 1 14.889 14.889Z"
      />
      <path
        data-name="Trazado 462"
        d="M192.898 109.951H62.537a8.455 8.455 0 0 0-8.455 8.455v99.762a8.456 8.456 0 0 0 8.456 8.457h130.36a8.456 8.456 0 0 0 8.455-8.455v-99.763a8.455 8.455 0 0 0-8.456-8.456ZM70.992 160.115h26.543v16.346H70.992Zm43.453 0h26.544v16.346h-26.544Zm43.454 0h26.544v16.346h-26.544Zm26.544-16.91h-26.544v-16.344h26.544Zm-43.454 0h-26.544v-16.344h26.544Zm-70-16.344h26.543v16.346H70.989Zm0 66.51h26.543v16.343H70.989Zm43.453 0h26.544v16.343h-26.544Zm70 16.343h-26.544v-16.343h26.544Z"
      />
      <path data-name="Rect\xE1ngulo 911" fill="none" d="M0 0h256v256H0z" />
    </g>
  </svg>
);

export default FileXlsIcon;
