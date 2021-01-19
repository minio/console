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
import SvgIcon from "@material-ui/core/SvgIcon";

const ShareIcon = () => {
  return (
    <SvgIcon>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13">
        <path
          d="M11.05 8.617v2.429h-9.1v-9.1h2.429v-1.95H0v13h13V8.617z"
          className="a"
        ></path>
        <path
          d="M3.854 9.256h1.95a4.945 4.945 0 013.6-4.74v1.3l.6-.487 2.474-2.012L9.4.817v1.7a6.9 6.9 0 00-5.546 6.739z"
          className="a"
        ></path>
      </svg>
    </SvgIcon>
  );
};

export default ShareIcon;
