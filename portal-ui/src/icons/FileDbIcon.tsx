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

const FileDbIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.281 0 256 256"
    >
      <path
        data-name="Trazado 438"
        d="M107.662 93.007c-30.337 0-62.989 7.141-62.989 22.82v79.924c0 15.678 32.651 22.82 62.989 22.82s62.989-7.142 62.989-22.82v-79.924c-.001-15.679-32.652-22.82-62.989-22.82zm49.139 102.743c-.12 2.517-15.67 10.8-49.139 10.8-33.187 0-48.925-8.288-49.14-10.8v-25.689c11.441 4.913 29.524 7.81 49.14 7.81 19.684 0 37.763-2.908 49.139-7.843zm0-40.7c-.223 2.52-15.96 10.8-49.139 10.8s-48.925-8.29-49.14-10.8v-24.252c11.42 4.937 29.5 7.846 49.14 7.846 19.684 0 37.763-2.907 49.139-7.842zm-49.139-28.42c-33.187 0-48.925-8.289-49.14-10.8.214-2.518 15.952-10.807 49.14-10.807s48.925 8.289 49.139 10.8c-.214 2.515-15.952 10.805-49.139 10.805z"
      />
      <path
        data-name="Trazado 439"
        d="M70.361 178.681a9.167 9.167 0 00-9.158 9.156 9.167 9.167 0 009.158 9.158 9.167 9.167 0 009.158-9.158 9.167 9.167 0 00-9.158-9.156z"
      />
      <path
        data-name="Trazado 440"
        d="M70.361 140.289a9.168 9.168 0 00-9.158 9.157 9.167 9.167 0 009.158 9.158 9.167 9.167 0 009.158-9.158 9.168 9.168 0 00-9.158-9.157z"
      />
      <path
        data-name="Trazado 441"
        d="M216.996 77.194c.387-15.753.958-32.242-.5-47.941-1.093-11.755-6.192-21.736-17.831-25.914a42.719 42.719 0 00-5.016-1.448c-6.549-1.477-13.432-1.6-20.09-1.8-11.727-.344-23.448.366-35.176.314-23.494-.1-46.986.323-70.478.414q-4.229.018-8.457.017H17.243a17.26 17.26 0 00-17.24 17.24v220.681a17.26 17.26 0 0017.24 17.241h182.539a17.261 17.261 0 0017.241-17.241V128.811c-.002-17.183-.449-34.454-.027-51.617zm-20.922 145.987a14.888 14.888 0 01-14.888 14.888H32.818a14.888 14.888 0 01-14.889-14.888V33.657a14.888 14.888 0 0114.889-14.888h99.548v25.458a37.8 37.8 0 0037.756 37.758h25.952zm0-157.656h-25.952a21.32 21.32 0 01-21.295-21.3V18.767h32.359a14.888 14.888 0 0114.888 14.888z"
      />
    </svg>
  );
};

export default FileDbIcon;
