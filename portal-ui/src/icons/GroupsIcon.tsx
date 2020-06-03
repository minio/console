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
class GroupsIcon extends React.Component {
  render() {
    return (
      <SvgIcon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 9.787">
          <g transform="translate(177 719.787)">
            <g transform="translate(-105 -720)">
              <path d="M-65,5a3,3,0,0,0-1.131.224A3.981,3.981,0,0,1-65,8v2h3V8A3,3,0,0,0-65,5Z" />
              <path d="M-72,10h6V8a3,3,0,0,0-3-3,3,3,0,0,0-3,3Z" />
              <path
                className="a"
                d="M-65,.213a1.993,1.993,0,0,0-1.384.561A2.967,2.967,0,0,1-66,2.213a2.964,2.964,0,0,1-.384,1.439A1.989,1.989,0,0,0-65,4.213a2,2,0,0,0,2-2A2,2,0,0,0-65,.213Z"
              />
              <circle cx="2" cy="2" r="2" transform="translate(-71 0.213)" />
            </g>
          </g>
        </svg>
      </SvgIcon>
    );
  }
}

export default GroupsIcon;
