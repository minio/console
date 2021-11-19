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

const TiersIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 236.312 256"
    >
      <path
        data-name="Trazado 441"
        d="M118.387 0a9.847 9.847 0 00-5.154 1.308L4.925 63.851a9.847 9.847 0 000 17.039l33.4 19.289-33.4 19.289a9.847 9.847 0 000 17.058l33.4 19.27-33.4 19.289a9.847 9.847 0 000 17.058l108.308 62.54a9.847 9.847 0 009.846 0l108.308-62.54a9.847 9.847 0 000-17.058l-33.4-19.289 33.4-19.27a9.847 9.847 0 000-17.058l-33.4-19.289 33.4-19.289a9.847 9.847 0 000-17.039L123.079 1.311A9.847 9.847 0 00118.387 0zM58.041 111.563l55.192 31.866a9.847 9.847 0 009.846 0l55.192-31.866 28.5 16.443-88.615 51.154-88.616-51.154zm-.02 55.617l55.212 31.866a9.847 9.847 0 009.846 0l55.212-31.866 28.481 16.443-88.615 51.155-88.617-51.156z"
      />
    </svg>
  );
};

export default TiersIcon;
