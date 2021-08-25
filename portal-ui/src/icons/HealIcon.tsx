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
const HealIcon = ({ width = 24, color }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width, color: color }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.016 10.994">
        <path
          data-name="heal-icn"
          d="M6.664 9.834l-.186-.186-.973-.968-1.154 1.154a2.242 2.242 0 01-1.594.66 2.235 2.235 0 01-1.594-.66 2.23 2.23 0 01-.664-1.6 2.227 2.227 0 01.664-1.594l1.154-1.153-.973-.973-.182-.181a2.23 2.23 0 01-.664-1.6 2.227 2.227 0 01.664-1.594 2.3 2.3 0 013.188 0l.186.181.969.973 1.158-1.154a2.3 2.3 0 013.188 0 2.227 2.227 0 01.664 1.594 2.23 2.23 0 01-.664 1.6L8.697 5.487l.973.968.182.186a2.227 2.227 0 01.664 1.594 2.23 2.23 0 01-.664 1.6 2.242 2.242 0 01-1.594.66 2.242 2.242 0 01-1.594-.661zm.533-.9l.18.181a1.277 1.277 0 001.762 0 1.235 1.235 0 00.361-.88 1.225 1.225 0 00-.361-.875l-.187-.186zM1.879 7.36a1.219 1.219 0 00-.363.875 1.228 1.228 0 00.363.88 1.275 1.275 0 001.76 0l1.152-1.153-1.76-1.76zm.9-2.845l.254.254 3.193 3.192.254.254 1.76-1.76-.254-.254-3.193-3.187-.254-.254zm4.6-2.654L6.227 3.015l1.76 1.755 1.154-1.154a1.235 1.235 0 00.361-.88 1.223 1.223 0 00-.361-.875 1.24 1.24 0 00-.881-.355 1.24 1.24 0 00-.883.354zm-5.5 0a1.217 1.217 0 00-.363.875 1.228 1.228 0 00.363.88l.186.186 1.754-1.76-.18-.181a1.221 1.221 0 00-.881-.367 1.216 1.216 0 00-.879.366zM6.01 6.486a.5.5 0 01.5-.5.5.5 0 01.5.5.5.5 0 01-.5.5.5.5 0 01-.5-.501zm-1-1a.5.5 0 01.5-.5.5.5 0 01.5.5.5.5 0 01-.5.5.5.5 0 01-.502-.498zm-1-1a.5.5 0 01.5-.5.5.5 0 01.5.5.5.5 0 01-.5.5.5.5 0 01-.5-.501z"
          strokeMiterlimit={10}
        />
      </svg>
    </SvgIcon>
  );
};

export default HealIcon;
