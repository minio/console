// This file is part of MinIO Console Server
// Copyright (c) 2020 MinIO, Inc.
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
class WatchIcon extends React.Component {
  render() {
    return (
      <SvgIcon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
          <g transform="translate(213 720)">
            <g transform="translate(-105 -720)">
              <rect width="1.5" height="4" transform="translate(-108)" />
              <rect width="1.5" height="4" transform="translate(-108 6)" />
              <rect width="1.5" height="4" transform="translate(-99.5 6)" />
              <rect width="1.5" height="4" transform="translate(-99.5)" />
              <rect
                width="1.5"
                height="4"
                transform="translate(-98) rotate(90)"
              />
              <rect
                width="1.5"
                height="4"
                transform="translate(-104) rotate(90)"
              />
              <rect
                width="1.5"
                height="4"
                transform="translate(-104 8.5) rotate(90)"
              />
              <rect
                width="1.5"
                height="4"
                transform="translate(-98 8.5) rotate(90)"
              />
              <circle cx="2" cy="2" r="2" transform="translate(-105 3)" />
            </g>
          </g>
        </svg>
      </SvgIcon>
    );
  }
}

export default WatchIcon;
