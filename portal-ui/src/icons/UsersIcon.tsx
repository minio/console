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

interface IUsersIcon {
  width?: number;
}

const UsersIcon = ({ width = 24 }: IUsersIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.289 15.273">
        <path
          data-name="Trazado 331"
          d="M5.651 8.5a4.257 4.257 0 004.252-4.252A4.257 4.257 0 005.651-.004a4.257 4.257 0 00-4.252 4.252A4.257 4.257 0 005.651 8.5zm0-7.322a3.073 3.073 0 013.07 3.07 3.073 3.073 0 01-3.07 3.07 3.073 3.073 0 01-3.069-3.07 3.073 3.073 0 013.069-3.066z"
        />
        <path
          data-name="Trazado 332"
          d="M10.836 11.928a6.493 6.493 0 00-2.457-1.954 6.58 6.58 0 00-3.076-.609 6.566 6.566 0 00-4.8 2.513c-.037.049-.072.1-.107.147a2.149 2.149 0 00-.164 2.2 1.936 1.936 0 001.756 1.043h7.331a1.909 1.909 0 001.754-1.057 2.2 2.2 0 00-.237-2.283zm-.824 1.762a.72.72 0 01-.7.4H1.981a.751.751 0 01-.708-.406.957.957 0 01.081-.979l.085-.116a5.356 5.356 0 013.919-2.044c.084 0 .168-.006.251-.006a5.486 5.486 0 014.279 2.1 1.023 1.023 0 01.124 1.051z"
        />
      </svg>
    </SvgIcon>
  );
};

export default UsersIcon;
