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

const FileCodeIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.281 0 256 256"
    >
      <path
        data-name="Trazado 432"
        d="M216.997 77.194c.387-15.753.958-32.242-.5-47.941-1.093-11.756-6.192-21.735-17.831-25.916a42.532 42.532 0 00-5.016-1.447C187.1.412 180.218.29 173.56.09c-11.727-.343-23.45.366-35.176.314-23.494-.1-46.986.322-70.479.414q-4.228.018-8.456.017H17.243A17.26 17.26 0 00.003 18.076v220.679a17.26 17.26 0 0017.24 17.241h182.54a17.26 17.26 0 0017.24-17.241V128.812c-.002-17.183-.452-34.459-.026-51.618zm-20.926 145.992a14.888 14.888 0 01-14.889 14.888H32.813a14.888 14.888 0 01-14.888-14.888V33.658A14.888 14.888 0 0132.813 18.77h99.549v25.459a37.8 37.8 0 0037.756 37.759h25.953zm0-157.656h-25.952a21.32 21.32 0 01-21.295-21.3V18.771h32.358a14.888 14.888 0 0114.889 14.887z"
      />
      <path
        data-name="Trazado 433"
        d="M123.246 86.683a7.664 7.664 0 00-5.873.748 7.727 7.727 0 00-3.655 4.732L86.111 194.825a7.777 7.777 0 005.464 9.515 7.487 7.487 0 002.023.276 7.829 7.829 0 003.886-1.038 7.643 7.643 0 003.63-4.713L128.72 96.203a7.781 7.781 0 00-5.474-9.52z"
      />
      <path
        data-name="Trazado 434"
        d="M57.407 145.409l20.711-20.71a7.78 7.78 0 000-10.99 7.8 7.8 0 00-10.985 0l-.224.278c-.44.642-3.849 3.92-7.146 7.09-17.4 16.732-21.453 21.528-21.139 24-.5 3.044 4.393 8.7 20.83 24.509 3.423 3.292 6.963 6.7 7.418 7.429l.213.275a7.34 7.34 0 005.313 2.366 7.162 7.162 0 001.8-.232 8.625 8.625 0 006-5.946 7.17 7.17 0 00-2.045-7.1z"
      />
      <path
        data-name="Trazado 435"
        d="M140.276 111.618a8.618 8.618 0 00-5.932 6 7.188 7.188 0 002.121 7.095l20.906 20.685-20.9 20.9a7.5 7.5 0 00-1.677 8.451 7.574 7.574 0 006.88 4.852 2.284 2.284 0 00.538.062c2.979 0 8.8-5.225 24.1-21.218 3.243-3.389 6.6-6.894 7.281-7.345l.282-.224a7.734 7.734 0 002.277-5.524 7.747 7.747 0 00-2.308-5.523L147.4 113.665a7.189 7.189 0 00-7.124-2.047z"
      />
    </svg>
  );
};

export default FileCodeIcon;
