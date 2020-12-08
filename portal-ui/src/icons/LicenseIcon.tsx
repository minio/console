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

const LicenseIcon = () => {
  return (
    <SvgIcon>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 11">
        <path fill="#fff" d="M11 11H0V2h11v9zM2 8v1h7V8zm0-3v1h5V5z"></path>
        <g
          fill="#07274a"
          stroke="#fdfdfd"
          strokeWidth="0.5"
          transform="translate(7)"
        >
          <circle cx="3" cy="3" r="3" stroke="none"></circle>
          <circle cx="3" cy="3" r="2.75" fill="none"></circle>
        </g>
        <path
          fill="none"
          stroke="#fff"
          strokeWidth="0.5"
          d="M8.73 2.794l.954.953 1.471-1.471"
        ></path>
      </svg>
    </SvgIcon>
  );
};

export default LicenseIcon;
