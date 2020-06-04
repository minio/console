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
class TraceIcon extends React.Component {
  render() {
    return (
      <SvgIcon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9.998 10">
          <g transform="translate(140.999 720)">
            <g transform="translate(-105 -720)">
              <rect
                width="1.114"
                height="1.667"
                transform="translate(-27.116 8.333)"
              />
              <path d="M-28.184,10H-29.3V8.154l2.182-3.037V3.147H-26V5.476l-2.182,3.037Z" />
              <rect
                width="1.114"
                height="2.963"
                transform="translate(-31.531)"
              />
              <rect
                width="1.114"
                height="2.132"
                transform="translate(-27.115 0)"
              />
              <rect
                width="1.114"
                height="5.389"
                transform="translate(-29.298)"
              />
              <path d="M-30.417,10h-1.114V5.722l-2.233-3V0h1.114V2.353l2.233,3Z" />
              <path d="M-32.65,10h-1.114V6.185l-2.234-3V0h1.114V2.815l2.234,3Z" />
              <rect
                width="1.114"
                height="4.463"
                transform="translate(-35.999 5.537)"
              />
            </g>
          </g>
        </svg>
      </SvgIcon>
    );
  }
}

export default TraceIcon;
