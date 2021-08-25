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
const HistoryIcon = ({ width = 24, color }: IIcon) => {
  return (
    <SvgIcon style={{ width: width, height: width, color: color }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22.694 19.521">
        <path
          data-name="Trazado 371"
          d="M12.934 0a9.768 9.768 0 00-9.755 9.641L2.028 8.49A1.18 1.18 0 00.36 10.159l3.344 3.344a1.18 1.18 0 001.682 0l3.343-3.344A1.18 1.18 0 007.061 8.49L5.812 9.739a7.13 7.13 0 017.122-7.1 7.131 7.131 0 017.123 7.123 7.131 7.131 0 01-7.123 7.123 1.319 1.319 0 00-1.319 1.319 1.319 1.319 0 001.319 1.319 9.772 9.772 0 009.761-9.76A9.772 9.772 0 0012.934 0z"
        />
        <path
          data-name="Trazado 372"
          d="M13.409 5.529a.537.537 0 00-.107-.385.54.54 0 00-.4-.1l-.668.009a.46.46 0 00-.3.074.459.459 0 00-.106.36c0 1.706 0 3.412-.005 5.119v.085l3.651 3.649a.428.428 0 00.207.138.4.4 0 00.3-.112 3.255 3.255 0 00.637-.639.41.41 0 00.113-.3.437.437 0 00-.143-.215l-2.676-2.66a1.837 1.837 0 01-.426-.546 1.858 1.858 0 01-.094-.78q.043-1.852.017-3.697z"
        />
      </svg>
    </SvgIcon>
  );
};

export default HistoryIcon;
