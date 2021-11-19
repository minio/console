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

const FileCloudIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.281 0 256 256"
    >
      <path
        data-name="Trazado 456"
        d="M216.997 77.194c.388-15.754.958-32.242-.5-47.942-1.093-11.755-6.192-21.735-17.831-25.915a42.482 42.482 0 00-5.016-1.447C187.1.411 180.217.29 173.56.09c-11.727-.343-23.45.365-35.176.314-23.494-.1-46.986.322-70.479.414q-4.228.016-8.456.017H17.243A17.26 17.26 0 00.002 18.075v220.679a17.26 17.26 0 0017.241 17.24h182.54a17.26 17.26 0 0017.241-17.24V128.812c-.002-17.184-.45-34.46-.027-51.618zm-20.923 145.983a14.889 14.889 0 01-14.889 14.889H32.816a14.889 14.889 0 01-14.888-14.889V33.658A14.887 14.887 0 0132.816 18.77h99.549v25.458a37.8 37.8 0 0037.756 37.76h25.952zm0-157.656h-25.952a21.32 21.32 0 01-21.295-21.3V18.763h32.358a14.888 14.888 0 0114.889 14.888z"
      />
      <path
        data-name="Trazado 457"
        d="M120.566 84.761a46.767 46.767 0 00-42.22 26.113 42.781 42.781 0 00-5.095-.3 42.915 42.915 0 00-42.866 42.867 42.916 42.916 0 0042.866 42.866h73.123a38.609 38.609 0 0038.566-38.565 38.754 38.754 0 00-17.656-32.377 46.973 46.973 0 00-46.718-40.604zm25.809 94.632H73.252a25.986 25.986 0 01-25.957-25.957 25.987 25.987 0 0125.957-25.957 25.524 25.524 0 017.753 1.2 8.461 8.461 0 006.505-.577 8.447 8.447 0 004.154-5.039 29.968 29.968 0 0128.9-21.39 30.142 30.142 0 0130.24 29.173 8.454 8.454 0 004.83 7.341 21.744 21.744 0 0112.395 19.553 21.68 21.68 0 01-21.654 21.653z"
      />
    </svg>
  );
};

export default FileCloudIcon;
