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

import React, { SVGProps } from "react";

const DiagnosticsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
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
          data-name="Uni\xF3n 17"
          d="M.449 128.494A128.188 128.188 0 0 1 128.494.45h10.6v52.857a76.1 76.1 0 0 1 46.531 25.151 75.572 75.572 0 0 1 13.854 22.845 75.251 75.251 0 0 1 5.039 27.189 76.11 76.11 0 0 1-76.023 76.022 76.1 76.1 0 0 1-76.012-76.022 75.291 75.291 0 0 1 5.037-27.189 75.678 75.678 0 0 1 13.85-22.845 76.135 76.135 0 0 1 46.555-25.151v-31.18a106.369 106.369 0 0 0-19.6 3.814 106.378 106.378 0 0 0-18.193 7.25 107.579 107.579 0 0 0-16.385 10.312A108.253 108.253 0 0 0 49.54 56.524a108.229 108.229 0 0 0-11.676 15.37 107.348 107.348 0 0 0-8.787 17.356 106.17 106.17 0 0 0-7.459 39.244 107.008 107.008 0 0 0 106.877 106.892 107.017 107.017 0 0 0 106.9-106.892 10.5 10.5 0 0 1 3.1-7.479 10.49 10.49 0 0 1 7.475-3.1 10.593 10.593 0 0 1 10.584 10.58 128.2 128.2 0 0 1-128.057 128.057A128.2 128.2 0 0 1 .449 128.494Zm99.967-47.048a55.106 55.106 0 0 0-14.062 12.016 54.643 54.643 0 0 0-9.336 16.083 54.492 54.492 0 0 0-3.379 18.95 54.464 54.464 0 0 0 4.316 21.333 54.924 54.924 0 0 0 5.068 9.317 55.648 55.648 0 0 0 6.7 8.12 55.546 55.546 0 0 0 8.125 6.7 54.955 54.955 0 0 0 9.316 5.068 54.353 54.353 0 0 0 21.328 4.316 54.917 54.917 0 0 0 54.854-54.857 54.492 54.492 0 0 0-3.379-18.95 54.614 54.614 0 0 0-9.326-16.083 55.144 55.144 0 0 0-14.049-12.016 54.571 54.571 0 0 0-17.5-6.723v30.482a25.816 25.816 0 0 1 10.824 9.254 25.366 25.366 0 0 1 4.211 14.035 25.433 25.433 0 0 1-2.014 9.982 25.524 25.524 0 0 1-5.494 8.145 25.5 25.5 0 0 1-8.145 5.493 25.518 25.518 0 0 1-9.982 2.015 25.477 25.477 0 0 1-9.973-2.015 25.621 25.621 0 0 1-8.148-5.493 25.538 25.538 0 0 1-5.488-8.145 25.522 25.522 0 0 1-2.016-9.982 25.393 25.393 0 0 1 4.207-14.035 25.82 25.82 0 0 1 10.848-9.254V74.72a54.537 54.537 0 0 0-17.508 6.73Z"
        />
        <path data-name="Rect\xE1ngulo 878" fill="none" d="M0 0h256v256H0z" />
      </g>
    </svg>
  );
};

export default DiagnosticsIcon;
