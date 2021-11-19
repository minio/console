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

const FileXlsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.281 0 256 256"
    >
      <path
        data-name="Trazado 461"
        d="M216.997 77.195c.386-15.753.957-32.242-.5-47.942-1.094-11.755-6.193-21.735-17.832-25.914a42.458 42.458 0 00-5.017-1.448c-6.549-1.479-13.432-1.6-20.09-1.8-11.726-.343-23.448.366-35.176.314-23.494-.1-46.985.324-70.479.415q-4.228.017-8.456.017H17.241A17.26 17.26 0 00.001 18.079v220.678a17.26 17.26 0 0017.24 17.24H199.78a17.259 17.259 0 0017.24-17.24V128.812c.002-17.183-.44-34.458-.023-51.617zm-20.922 145.988a14.888 14.888 0 01-14.888 14.888H32.819a14.888 14.888 0 01-14.888-14.888V33.658A14.888 14.888 0 0132.819 18.77h99.547v25.459a37.8 37.8 0 0037.757 37.758h25.952zm0-157.657h-25.952a21.32 21.32 0 01-21.295-21.3V18.767h32.359a14.888 14.888 0 0114.888 14.888z"
      />
      <path
        data-name="Trazado 462"
        d="M173.9 109.948H43.539a8.455 8.455 0 00-8.455 8.455v99.762a8.455 8.455 0 008.455 8.456H173.9a8.456 8.456 0 008.455-8.456v-99.761a8.455 8.455 0 00-8.455-8.456zM51.994 160.112h26.543v16.346H51.994zm43.453 0h26.544v16.346H95.447zm43.454 0h26.544v16.346h-26.544zm26.544-16.91h-26.544v-16.344h26.544zm-43.454 0H95.447v-16.344h26.544zm-70-16.344h26.543v16.346H51.991zm0 66.51h26.543v16.343H51.991zm43.453 0h26.544v16.343H95.444zm70 16.343H138.9v-16.343h26.544z"
      />
    </svg>
  );
};

export default FileXlsIcon;
