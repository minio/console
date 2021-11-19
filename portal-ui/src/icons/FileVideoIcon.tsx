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

const FileVideoIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-19.281 0 256 256"
    >
      <path
        data-name="Trazado 424"
        d="M216.997 77.193c.387-15.754.958-32.242-.5-47.942-1.092-11.755-6.192-21.735-17.832-25.915a42.471 42.471 0 00-5.016-1.447C187.1.41 180.217.289 173.559.089c-11.726-.344-23.449.364-35.176.314-23.494-.1-46.985.322-70.479.414q-4.229.016-8.456.017H17.242a17.26 17.26 0 00-17.24 17.24v220.68a17.26 17.26 0 0017.24 17.24H199.78a17.26 17.26 0 0017.241-17.24V128.812c0-17.184-.441-34.459-.024-51.619zM196.075 223.18a14.889 14.889 0 01-14.888 14.888H32.818A14.889 14.889 0 0117.93 223.18V33.658A14.888 14.888 0 0132.818 18.77h99.547v25.458a37.8 37.8 0 0037.757 37.76h25.952zm0-157.657h-25.952a21.32 21.32 0 01-21.295-21.3V18.765h32.359a14.888 14.888 0 0114.888 14.888z"
      />
      <path
        data-name="Trazado 425"
        d="M152.916 125L91.593 89.593a17.725 17.725 0 00-17.9 0 17.718 17.718 0 00-8.952 15.5v70.811a17.718 17.718 0 008.951 15.5 17.866 17.866 0 008.952 2.427 17.872 17.872 0 008.952-2.427l61.323-35.4a17.723 17.723 0 008.952-15.5A17.72 17.72 0 00152.916 125zm-8.455 16.362l-61.323 35.4a.914.914 0 01-.992 0 .912.912 0 01-.5-.86v-70.811a.909.909 0 01.5-.858 1 1 0 01.5-.147.959.959 0 01.489.146l61.323 35.407a.909.909 0 01.5.858.911.911 0 01-.497.865z"
      />
    </svg>
  );
};

export default FileVideoIcon;
