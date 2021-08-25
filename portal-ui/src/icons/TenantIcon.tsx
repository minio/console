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

import React from "react";
import { SvgIcon } from "@material-ui/core";
import { IIcon } from "./props";
const TenantIcon = ({ width = 24 }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.228 47">
        <path
          data-name="Trazado 394"
          d="M39.085 16.192a4.7 4.7 0 00-4.2 2.6l-8-1.163a13.448 13.448 0 00.522-3.712A13.48 13.48 0 0013.928.437a13.48 13.48 0 00-13.48 13.48 13.481 13.481 0 0011.814 13.374l-.249 4.585h-.067a3.326 3.326 0 00-3.327 3.326 3.326 3.326 0 003.327 3.327 3.326 3.326 0 003.327-3.327 3.323 3.323 0 00-1.418-2.722l.277-5.084a13.422 13.422 0 005.781-1.4l7.133 9.262a6.63 6.63 0 00-1.894 4.645 6.653 6.653 0 006.653 6.653 6.652 6.652 0 006.652-6.653 6.652 6.652 0 00-6.652-6.653 6.612 6.612 0 00-3.276.867l-6.99-9.075a13.526 13.526 0 004.691-5.616l8.171 1.187c-.005.094-.014.186-.014.28a4.7 4.7 0 004.7 4.7 4.7 4.7 0 004.7-4.7 4.7 4.7 0 00-4.702-4.701z"
        />
        <path
          data-name="Trazado 395"
          d="M31.797 47a7.1 7.1 0 01-7.093-7.094 7.048 7.048 0 011.758-4.67l-6.689-8.685a13.744 13.744 0 01-5.231 1.273L14.3 32.27a3.776 3.776 0 011.406 2.933 3.772 3.772 0 01-3.767 3.766 3.771 3.771 0 01-3.767-3.766 3.773 3.773 0 013.416-3.751l.206-3.777A13.929 13.929 0 01.001 13.921 13.936 13.936 0 0113.921 0a13.936 13.936 0 0113.92 13.921 13.9 13.9 0 01-.409 3.348l7.207 1.047a5.113 5.113 0 014.446-2.564 5.15 5.15 0 015.144 5.145 5.15 5.15 0 01-5.144 5.145 5.15 5.15 0 01-5.144-5.045l-7.456-1.083a13.963 13.963 0 01-4.324 5.226l6.482 8.418a7.1 7.1 0 013.154-.743 7.1 7.1 0 017.093 7.093A7.1 7.1 0 0131.797 47zM20.033 25.444l7.588 9.852-.267.274a6.174 6.174 0 00-1.769 4.336 6.219 6.219 0 006.212 6.213 6.219 6.219 0 006.212-6.213 6.219 6.219 0 00-6.212-6.212 6.21 6.21 0 00-3.058.809l-.333.188-7.507-9.748.384-.263a13.076 13.076 0 004.538-5.432l.136-.3 8.9 1.292-.025.4c-.009.136-.013.194-.013.254a4.269 4.269 0 004.264 4.264 4.268 4.268 0 004.263-4.264 4.268 4.268 0 00-4.263-4.264 4.241 4.241 0 00-3.811 2.359l-.143.285-8.815-1.281.139-.484a13.08 13.08 0 00.5-3.591A13.054 13.054 0 0013.913.878 13.054 13.054 0 00.874 13.918a13.046 13.046 0 0011.427 12.937l.409.05-.3 5.42-.425-.008h-.007A2.9 2.9 0 009.041 35.2a2.889 2.889 0 002.886 2.885 2.89 2.89 0 002.886-2.885 2.894 2.894 0 00-1.23-2.362l-.2-.14.313-5.739.41-.006a12.907 12.907 0 005.591-1.35z"
        />
      </svg>
    </SvgIcon>
  );
};

export default TenantIcon;
