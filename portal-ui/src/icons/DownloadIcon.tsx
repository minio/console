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

const DownloadIcon = () => {
  return (
    <SvgIcon>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 12.996">
        <path d="M11.05 9.096v1.95h-9.1v-1.95H0v3.9h13v-3.9z"></path>
        <path d="M6.5 9.75L9 6.672H7.475V0h-1.95v6.672H4z"></path>
      </svg>
    </SvgIcon>
  );
};

export default DownloadIcon;
