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

const PreviewIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 -45.3345 255.534 255.534"
    >
      <path
        data-name="Trazado 408"
        d="M250.595 66.052A146.967 146.967 0 00127.767 0 146.965 146.965 0 004.94 66.052a29.628 29.628 0 000 32.76 146.965 146.965 0 00122.827 66.052 146.967 146.967 0 00122.828-66.052 29.63 29.63 0 000-32.76zm-17.648 21.08a125.854 125.854 0 01-105.18 56.57 125.855 125.855 0 01-105.18-56.57 8.5 8.5 0 010-9.4 125.855 125.855 0 01105.18-56.57 125.855 125.855 0 01105.18 56.569 8.5 8.5 0 010 9.401z"
      />
      <path
        data-name="Trazado 409"
        d="M127.767 28.002a54.492 54.492 0 00-54.431 54.43 54.492 54.492 0 0054.431 54.431 54.493 54.493 0 0054.431-54.431 54.493 54.493 0 00-54.431-54.43zm0 87.7a33.305 33.305 0 01-33.268-33.268 33.305 33.305 0 0133.268-33.267 33.305 33.305 0 0133.263 33.265 33.305 33.305 0 01-33.263 33.268z"
      />
    </svg>
  );
};

export default PreviewIcon;
