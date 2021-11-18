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

const FileLockIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.281 0 256 256"
    >
      <path
        data-name="Trazado 467"
        d="M216.995 77.194c.388-15.753.958-32.241-.5-47.941-1.094-11.756-6.192-21.735-17.831-25.916a42.7 42.7 0 00-5.016-1.447c-6.551-1.479-13.433-1.6-20.09-1.8-11.727-.343-23.449.364-35.176.313-23.494-.1-46.986.324-70.48.415q-4.226.015-8.455.017H17.241A17.26 17.26 0 00.001 18.076v220.678a17.26 17.26 0 0017.24 17.241h182.541a17.26 17.26 0 0017.241-17.241V128.812c-.001-17.183-.447-34.459-.028-51.618zm-20.921 145.989a14.888 14.888 0 01-14.888 14.887H32.817a14.888 14.888 0 01-14.888-14.887V33.658A14.888 14.888 0 0132.817 18.77h99.548v25.458a37.8 37.8 0 0037.757 37.76h25.952zm0-157.657h-25.952a21.32 21.32 0 01-21.295-21.3V18.768h32.358a14.889 14.889 0 0114.888 14.888z"
      />
      <path
        data-name="Trazado 468"
        d="M148.462 106.733h-11.678V94.557a28.114 28.114 0 00-28.066-27.984h-.044a28.117 28.117 0 00-28.069 27.99v12.17H68.924A23.834 23.834 0 0045.148 130.5v45.491a23.675 23.675 0 0022.986 23.75l40.558 7.889 40.559-7.889a23.675 23.675 0 0022.986-23.753v-45.492a23.832 23.832 0 00-23.775-23.763zM95.59 94.563a13.109 13.109 0 0113.091-13.042h.023a13.107 13.107 0 0113.087 13.042v12.17h-26.2zm61.656 81.424a8.83 8.83 0 01-8.788 8.821h-.725L108.69 192.4l-38.843-7.553-.4-.039h-.515a8.833 8.833 0 01-8.794-8.822v-45.49a8.831 8.831 0 018.789-8.82h79.529a8.831 8.831 0 018.794 8.821z"
      />
      <path
        data-name="Trazado 469"
        d="M108.556 141.524a12.366 12.366 0 00-12.352 12.351 12.324 12.324 0 004.507 9.544v7.2a7.547 7.547 0 007.517 7.511h.659a7.548 7.548 0 007.511-7.517v-7.191a12.326 12.326 0 004.507-9.542 12.367 12.367 0 00-12.349-12.356z"
      />
    </svg>
  );
};

export default FileLockIcon;
