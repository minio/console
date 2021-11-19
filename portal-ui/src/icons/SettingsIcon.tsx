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

const SettingsIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      className={`min-icon`}
      fill={"currentcolor"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
    >
      <defs>
        <clipPath id="prefix__a">
          <path d="M0 0h256v256H0z" />
        </clipPath>
      </defs>
      <g clipPath="url(#prefix__a)">
        <path
          data-name="Trazado 341"
          d="M247.385 99.227l-26.7-3.841a92.362 92.362 0 00-4.166-9.853l16.176-21.584a9.834 9.834 0 00-.9-12.9l-26.889-27.1a9.825 9.825 0 00-12.893-.887l-21.6 16.254a89.085 89.085 0 00-9.857-4.134l-3.83-26.7a9.856 9.856 0 00-9.852-8.476H108.73a9.843 9.843 0 00-9.844 8.476l-3.836 26.7a89.115 89.115 0 00-9.859 4.134L63.53 23.06a9.881 9.881 0 00-12.936.887l-26.881 26.9a9.832 9.832 0 00-.9 12.9l16.27 21.584a87.181 87.181 0 00-4.166 9.851l-26.68 3.843a9.85 9.85 0 00-8.482 9.854v38.036a9.851 9.851 0 008.482 9.854l26.68 3.84a85.76 85.76 0 004.166 9.855l-16.27 21.777a9.848 9.848 0 00.9 12.914l26.881 26.9a9.891 9.891 0 0012.936.879l21.561-16.256a85.986 85.986 0 009.859 4.136l3.844 26.705a9.843 9.843 0 009.857 8.475h38.031a9.867 9.867 0 009.859-8.475l3.842-26.705a90.284 90.284 0 009.859-4.136l21.568 16.157a9.852 9.852 0 0012.906-.878l26.9-26.9a9.856 9.856 0 00.889-12.915l-16.061-21.485a89.562 89.562 0 004.131-9.853l26.709-3.842a9.867 9.867 0 008.475-9.853v-38.133a9.868 9.868 0 00-8.374-9.749zm-11.236 39.413l-24.443 3.549a9.888 9.888 0 00-8.088 7.1 82.022 82.022 0 01-6.875 17.436 9.813 9.813 0 000 10.549l14.764 19.707-14.764 15.072-19.719-15.072a9.863 9.863 0 00-10.461 0 75.566 75.566 0 01-17.711 7.291 9.814 9.814 0 00-7.105 8.085l-3.549 24.034h-20.895l-3.549-24.436a9.8 9.8 0 00-7.092-8.073 76.134 76.134 0 01-17.738-7.294 9.831 9.831 0 00-10.439.393l-19.711 14.777-15.072-14.777 15.072-19.707a9.844 9.844 0 000-10.549 82.861 82.861 0 01-7.3-17.634 9.841 9.841 0 00-8.074-7.095l-24.035-3.55v-20.889l24.443-3.55a9.85 9.85 0 008.074-7.1 82.89 82.89 0 016.891-17.635 9.84 9.84 0 000-10.546l-15.072-19.71 15.072-15.071 19.711 15.071a9.816 9.816 0 0010.439 0 76.209 76.209 0 0117.738-7.291 9.806 9.806 0 007.092-8.074l3.549-24.044h20.895l3.549 24.435a9.839 9.839 0 007.105 8.084 75.193 75.193 0 0117.711 7.291 9.866 9.866 0 0010.461-.4l19.719-14.778 15.057 14.778-15.057 19.71a9.822 9.822 0 00-.7 10.839 82.237 82.237 0 017.3 17.644 9.84 9.84 0 008.074 7.088l24.443 3.547z"
        />
        <path
          data-name="Trazado 342"
          d="M127.742 78.73a49.269 49.269 0 00-49.258 49.275 49.266 49.266 0 0049.258 49.267 49.271 49.271 0 0049.281-49.267 49.274 49.274 0 00-49.281-49.275zm0 78.836a29.553 29.553 0 01-29.547-29.561 29.56 29.56 0 0129.547-29.57 29.555 29.555 0 0129.564 29.57 29.548 29.548 0 01-29.564 29.561z"
        />
      </g>
    </svg>
  );
};

export default SettingsIcon;
